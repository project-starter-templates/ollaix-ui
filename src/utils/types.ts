import type { AVAILABLE_MODELS } from "@/utils";

export type LlmModelType = keyof typeof AVAILABLE_MODELS;

export type ModelType = {
  id: string;
  name: string;
  description: string
  provider: "ollama" | "google";
}

export type ModelsResponseType = {
  data: ModelType[];
};

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
