import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <button
      className="btn btn-ghost btn-xs rounded-md hover:bg-base-content/12"
      onClick={handleCopy}
    >
      {copied ? <Check size={14} /> : <Copy size={14}/>}
    </button>
  );
}
