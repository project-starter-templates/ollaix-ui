import { ChatForm } from "@/components/ChatForm";
import { InitialMessage } from "@/components/InitialMessage";
import { useChat } from "@/hooks/useChat";

export function Home() {
  const {
    currentMessage,
    setCurrentMessage,
    selectedModel,
    setSelectedModel,
    isLoading,
    handleSendMessage,
    handleStopGeneration,
  } = useChat();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex-grow w-full overflow-y-auto p-4 md:p-6 relative">
        <div className="mx-auto w-[100%] max-w-[768px]">
          <InitialMessage />
        </div>
      </div>
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
