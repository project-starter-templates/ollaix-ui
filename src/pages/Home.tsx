import { ChatForm } from "@/components/ChatForm";
import { useChatStream } from "@/hooks/useChatStream";
import { ChatContainer } from "@/components/ChatContainer";

export function Home() {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    handleSendMessage,
    handleStopGeneration,
  } = useChatStream();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ChatContainer messages={messages} isLoading={isLoading} error={error} />
      <ChatForm
        currentMessage={currentMessage}
        onInputChange={setCurrentMessage}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        isLoading={isLoading}
      />
    </div>
  );
}
