import { API_BASE_URL } from "@/utils";
import type { LlmModelType, Message } from "@/utils/types";
import {
  extractThinkingContent,
  parseStreamingContent,
} from "@/utils/messageParser";

/**
 * Service for managing API calls and streaming responses
 */
export class ApiService {
  private abortController: AbortController | null = null;

  /**
   * Sends a message to the API and processes the response in streaming mode
   */
  async sendMessage(
    message: string,
    model: LlmModelType,
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
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, model }),
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
   * Stream the answer
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
        accumulatedResponseText += chunk;

        const { thinkingContent, cleanContent, isThinkingLoading } =
          parseStreamingContent(accumulatedResponseText);

        onMessageUpdate({
          content: cleanContent,
          thinkingContent,
          isThinkingLoading,
        });
      }
    } catch (error) {
      console.error("Error during streaming:", error);
      onError("Error processing response stream");
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
