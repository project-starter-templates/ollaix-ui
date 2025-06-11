import type { Message, ModelsResponseType, ModelType } from "@/utils/types";
import {
  extractThinkingContent,
  parseStreamingContent,
} from "@/utils/messageParser";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Service for managing API calls and streaming responses
 */
export class ApiService {
  private abortController: AbortController | null = null;

  /**
   * Converts internal messages to OpenAI format
   */
  private convertMessagesToOpenAI(
    messages: Message[]
  ): Array<{ role: string; content: string }> {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Get models from the API
   */
  async getModels(
    onModelsUpdate: (models: ModelType[]) => void
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: ModelsResponseType = await response.json();
    onModelsUpdate(data.data.sort((a, b) => b.name.localeCompare(a.name)));
  }

  /**
   * Sends a message to the API and processes the response in streaming mode
   */
  async sendMessage(
    message: string,
    model: string,
    conversationMessages: Message[],
    onMessageUpdate: (update: Partial<Message>) => void,
    onComplete: (finalMessage: Partial<Message>) => void,
    onError: (error: string) => void
  ): Promise<void> {
    // Cancels the previous query if it exists
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      // Prepare messages for OpenAI API
      const allMessages = [
        ...this.convertMessagesToOpenAI(conversationMessages),
        { role: "user", content: message },
      ];

      const payload = {
        model: model,
        messages: allMessages,
        stream: true,
      };

      const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `API request failed with status ${response.status}`,
        }));
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        );
      }

      await this.processStreamingResponse(
        response,
        signal,
        onMessageUpdate,
        onComplete,
        onError
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Fetch operation was aborted.");
      } else {
        console.error("Error sending message:", err);
        const errorMessage = err.message || "An unexpected error occurred.";
        onError(errorMessage);
      }
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Stream the answer with OpenAI format
   */
  private async processStreamingResponse(
    response: Response,
    signal: AbortSignal,
    onMessageUpdate: (update: Partial<Message>) => void,
    onComplete: (finalMessage: Partial<Message>) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader.");
    }

    const decoder = new TextDecoder();
    let accumulatedResponseText = "";
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Final treatment
          const { thinking, cleanContent } = extractThinkingContent(
            accumulatedResponseText
          );

          onComplete({
            content: cleanContent,
            thinkingContent: thinking,
            loaded: true,
            isThinkingLoading: false,
          });
          break;
        }

        if (signal.aborted) {
          console.log("Fetch aborted");
          const { thinking, cleanContent } = extractThinkingContent(
            accumulatedResponseText
          );

          onComplete({
            content: `${cleanContent} (Annulé)`,
            thinkingContent: thinking,
            isError: true,
            isThinkingLoading: false,
          });
          break;
        }

        // Chunk processing
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (trimmedLine === "") continue;

          if (trimmedLine.startsWith("data: ")) {
            const dataStr = trimmedLine.slice(6);

            if (dataStr === "[DONE]") {
              // Stream finished
              const { thinking, cleanContent } = extractThinkingContent(
                accumulatedResponseText
              );

              onComplete({
                content: cleanContent,
                thinkingContent: thinking,
                loaded: true,
                isThinkingLoading: false,
              });
              return;
            }

            try {
              const data = JSON.parse(dataStr);
              const content = data.choices?.[0]?.delta?.content;

              if (content) {
                accumulatedResponseText += content;

                const { thinkingContent, cleanContent, isThinkingLoading } =
                  parseStreamingContent(accumulatedResponseText);

                onMessageUpdate({
                  content: cleanContent,
                  thinkingContent,
                  isThinkingLoading,
                });
              }
            } catch (parseError) {
              // Ignore parsing errors for individual chunks
              console.warn("Failed to parse chunk:", dataStr);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Stream reading aborted by user.");
      } else {
        onError("Error processing response stream");
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Cancels the current query
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Checks whether a query is in progress
   */
  get isRequesting(): boolean {
    return this.abortController !== null;
  }

  /**
   * Cleans resources
   */
  cleanup(): void {
    this.abort();
  }
}
