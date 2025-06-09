import { useCallback, useEffect, useRef, useState } from "react";

import { ApiService } from "@/services/apiService";
import { DEFAULT_LLM_MODEL } from "@/utils";
import type { ModelType, LlmModelType, Message } from "@/utils/types";

/**
 * Main hook to manage chat with streaming
 */
export const useChatStream = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [models, setModels] = useState<ModelType[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<LlmModelType>(DEFAULT_LLM_MODEL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiServiceRef = useRef<ApiService | null>(null);

  // API service initialization
  useEffect(() => {
    apiServiceRef.current = new ApiService();

    apiServiceRef.current.getModels(setModels);

    return () => {
      apiServiceRef.current?.cleanup();
    };
  }, []);

  /**
   * Updates a specific message in the list
   */
  const updateMessage = useCallback(
    (messageId: string, updates: Partial<Message>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  /**
   * Create a new user message
   */
  const createUserMessage = useCallback(
    (content: string): Message => ({
      id: crypto.randomUUID(),
      content: content.trim(),
      role: "user",
    }),
    []
  );

  /**
   * Creates an AI placeholder message
   */
  const createAiMessagePlaceholder = useCallback(
    (model: LlmModelType): Message => ({
      id: crypto.randomUUID(),
      content: "",
      role: "assistant",
      model,
      thinkingContent: "",
      isThinkingLoading: false,
      loaded: false,
    }),
    []
  );

  /**
   * Get conversation history (excluding the AI message being generated)
   */
  const getConversationHistory = useCallback((): Message[] => {
    // Only include messages that are fully loaded/completed
    return messages.filter(msg => {
      // Include user messages (they're always complete)
      if (msg.role === "user") return true;
      // Include assistant messages only if they're loaded
      if (msg.role === "assistant") return msg.loaded === true;
      return true;
    });
  }, [messages]);

  /**
   * Manages message sending
   */
  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !apiServiceRef.current) return;

    setError(null);
    setIsLoading(true);

    // Create messages
    const userMessage = createUserMessage(currentMessage);
    const aiMessage = createAiMessagePlaceholder(selectedModel);

    // Get conversation history before adding new messages
    const conversationHistory = getConversationHistory();

    // Adds messages to the list
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setCurrentMessage("");

    // Callbacks for the API service
    const onMessageUpdate = (updates: Partial<Message>) => {
      updateMessage(aiMessage.id, updates);
    };

    const onComplete = (finalMessage: Partial<Message>) => {
      updateMessage(aiMessage.id, finalMessage);
      setIsLoading(false);
    };

    const onError = (errorMessage: string) => {
      setError(errorMessage);
      updateMessage(aiMessage.id, {
        content: `Erreur: ${errorMessage}`,
        model: selectedModel,
        isError: true,
        isThinkingLoading: false,
      });
      setIsLoading(false);
    };

    // Sends the message via the API service with conversation history
    await apiServiceRef.current.sendMessage(
      userMessage.content,
      selectedModel,
      conversationHistory,
      onMessageUpdate,
      onComplete,
      onError
    );
  }, [
    currentMessage,
    selectedModel,
    createUserMessage,
    createAiMessagePlaceholder,
    updateMessage,
    getConversationHistory,
  ]);

  /**
   * Stop the current generation
   */
  const handleStopGeneration = useCallback(() => {
    if (apiServiceRef.current?.isRequesting && isLoading) {
      apiServiceRef.current.abort();
      setIsLoading(false);

      // Marks the last message as interrupted
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        updateMessage(lastMessage.id, {
          isError: true,
          isThinkingLoading: false,
        });
      }
    }
  }, [isLoading, messages, updateMessage]);

  return {
    // State
    messages,
    currentMessage,
    models,
    selectedModel,
    isLoading,
    error,

    // Setters
    setCurrentMessage,
    setSelectedModel,

    // Actions
    handleSendMessage,
    handleStopGeneration,
  };
};
