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

    while ((match = thinkingRegex.exec(content)) !== null) {
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
      },
    ]);

    setCurrentMessage(""); // Clear input after sending
    setIsLoading(true);

    // Abort previous request if any
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
          // const cleanedFinalText = cleanThinkTags(accumulatedResponseText);
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
                  }
                : msg
            )
          );
          break;
        }
        if (signal.aborted) {
          console.log("Fetch aborted");
          // const cleanedAbortedText = cleanThinkTags(accumulatedResponseText);
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
                  }
                : msg
            )
          );
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponseText += chunk;

        // const cleanedStreamingText = cleanThinkTags(accumulatedResponseText);
        const { thinking, cleanContent } = extractThinkingContent(
          accumulatedResponseText
        );
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: cleanContent, thinkingContent: thinking }
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
