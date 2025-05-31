import { ChatForm } from "@/components/ChatForm";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex-grow w-full overflow-y-auto p-4 md:p-6 relative">
        <div className="mx-auto w-[100%] max-w-[768px]">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            alias molestiae, cumque, possimus ab maiores inventore commodi enim
            suscipit porro iusto ratione, doloremque ipsa dolores necessitatibus
            cupiditate excepturi fugit dignissimos.
          </p>
        </div>
      </div>
      <ChatForm currentMessage="" />
    </div>
  );
}
