import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { InitialMessage } from "@/components/InitialMessage";
import { type Message } from "@/utils/types";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const ChatContainer = ({
  messages,
  isLoading,
  error,
}: ChatContainerProps) => {
  const { t } = useTranslation();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-grow w-full overflow-y-auto p-4 md:p-6 relative"
      ref={chatContainerRef}
    >
      <div className="mx-auto w-[100%] max-w-[768px]">
        {messages.length === 0 && !isLoading && !error && <InitialMessage />}
        {error && messages.length === 0 && (
          <div className="text-center p-4">
            <p className="text-error font-semibold">{t("chat.error")}</p>
            <p className="text-error-content text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
