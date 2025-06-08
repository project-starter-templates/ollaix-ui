import type { AVAILABLE_MODELS } from "@/utils";

export type LlmModelType = keyof typeof AVAILABLE_MODELS;

export interface Message {
  id: string;
  content: string;
  thinkingContent?: string;
  role: "user" | "assistant";
  model?: LlmModelType;
  isError?: boolean;
  loaded?: boolean;
  isThinkingLoading?: boolean;
}
