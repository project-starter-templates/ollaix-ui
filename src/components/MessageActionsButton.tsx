import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { CopyButton } from "@/components/CopyButton";

type Props = {
  text?: string;
};

export function MessageActionsButton({ text }: Props) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  return (
    <div className="flex items-center mt-1">
      <CopyButton text={text} />
      {!disliked && (
        <button
          className="btn btn-ghost btn-xs rounded-md hover:bg-base-content/12"
          onClick={() => setLiked((prev) => !prev)}
        >
          <ThumbsUp size={14} fill={liked ? "currentColor" : "none"} />
        </button>
      )}
      {!liked && (
        <button
          className="btn btn-ghost btn-xs rounded-md hover:bg-base-content/12"
          onClick={() => setDisliked((prev) => !prev)}
        >
          <ThumbsDown size={14} fill={disliked ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}
