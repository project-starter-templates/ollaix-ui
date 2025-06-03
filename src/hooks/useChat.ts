import { useCallback, useEffect, useRef, useState } from "react";

import { API_BASE_URL, DEFAULT_LLM_MODEL } from "@/utils";
import type { LlmModelType, Message } from "@/utils/types";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [selectedModel, setSelectedModel] =
    useState<LlmModelType>(DEFAULT_LLM_MODEL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function for aborting fetch request
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const extractThinkingContent = (
    content: string
  ): { thinking: string; cleanContent: string } => {
    const thinkingRegex = /<think>([\s\S]*?)<\/think>/g;
    const thinkingMatches = [];
    let match;

    const tempContent = content;
    while ((match = thinkingRegex.exec(tempContent)) !== null) {
      thinkingMatches.push(match[1].trim());
    }

    const thinking = thinkingMatches.join("\n\n");
    const cleanContent = content
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();

    return { thinking, cleanContent };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    setError(null);

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      content: currentMessage.trim(),
      sender: "user",
    };

    // Add user message and a placeholder for AI response
    const aiMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      newUserMessage,
      {
        id: aiMessageId,
        content: "",
        sender: "ai",
        model: selectedModel,
        thinkingContent: "",
        isThinkingLoading: false,
        loaded: false,
      },
    ]);

    setCurrentMessage("");
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newUserMessage.content,
          model: selectedModel,
        }),
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `API request failed with status ${response.status}`,
        }));
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader.");
      }

      const decoder = new TextDecoder();
      let accumulatedResponseText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Once finished, make sure that all content is correctly parsed.
          const { thinking, cleanContent } = extractThinkingContent(
            accumulatedResponseText
          );
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: cleanContent,
                    thinkingContent: thinking,
                    loaded: true,
                    isThinkingLoading: false,
                  }
                : msg
            )
          );
          break;
        }
        if (signal.aborted) {
          console.log("Fetch aborted");
          const { thinking, cleanContent } = extractThinkingContent(
            accumulatedResponseText
          );
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: `${cleanContent} (Annulé)`,
                    thinkingContent: thinking,
                    isError: true,
                    isThinkingLoading: false,
                  }
                : msg
            )
          );
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponseText += chunk;

        // Initialize for each chunk
        let tempThinkingContent = "";
        let tempCleanContent = "";
        let currentIsThinkingLoading = false;

        const thinkStartTag = "<think>";
        const thinkEndTag = "</think>";

        let startIndex = accumulatedResponseText.indexOf(thinkStartTag);
        let endIndex = accumulatedResponseText.indexOf(thinkEndTag);

        if (startIndex !== -1 && (endIndex === -1 || endIndex < startIndex)) {
          // If <think> is found but not </think> (or </think> is before <think>), then thinking is in progress
          currentIsThinkingLoading = true;
          tempThinkingContent = accumulatedResponseText.substring(
            startIndex + thinkStartTag.length
          );
          tempCleanContent = accumulatedResponseText.substring(0, startIndex);
        } else if (
          startIndex !== -1 &&
          endIndex !== -1 &&
          endIndex > startIndex
        ) {
          // If both tags are found and </think> is after <think>, then thinking is finished for this chunk
          currentIsThinkingLoading = false;
          tempThinkingContent = accumulatedResponseText.substring(
            startIndex + thinkStartTag.length,
            endIndex
          );
          tempCleanContent =
            accumulatedResponseText.substring(0, startIndex) +
            accumulatedResponseText.substring(endIndex + thinkEndTag.length);
        } else {
          // No <think>...</think> tag or only normal text
          currentIsThinkingLoading = false;
          tempThinkingContent = "";
          tempCleanContent = accumulatedResponseText;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: tempCleanContent.trim(),
                  thinkingContent: tempThinkingContent.trim(),
                  isThinkingLoading: currentIsThinkingLoading,
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Fetch operation was aborted.");
      } else {
        console.error("Error sending message or processing stream:", err);
        const errorMessage = err.message || "An unexpected error occurred.";
        setError(errorMessage);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: `Erreur: ${errorMessage}`,
                  model: selectedModel,
                  isError: true,
                  isThinkingLoading: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current && isLoading) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      const lastMessage = messages[messages.length - 1];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === lastMessage.id
            ? {
                ...msg,
                isError: true,
                isThinkingLoading: false,
              }
            : msg
        )
      );
    }
  }, [isLoading]);

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    handleSendMessage,
    handleStopGeneration,
  };
};
