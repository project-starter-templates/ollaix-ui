import { useModels } from "@/hooks/useModels";
import type { Message } from "@/utils/types";

interface Props {
  message: Message;
  isUser: boolean;
}

export function ChatHeader({ message, isUser }: Props) {
  const models = useModels();

  if (isUser) return null;

  return (
    <div className="chat-header text-xs opacity-70 pb-1">
      <div className="flex items-center gap-2">
        <img src="/chatbot.png" alt="Ollaix" className="rounded-full size-8" />
        <span className="text-[13px]">
          {message.model
            ? `${models.find((m) => m.id === message.model)?.name}`
            : ""}
        </span>
      </div>
    </div>
  );
}
