export type ModelType = {
  id: string;
  name: string;
  description: string;
  provider: "ollama" | "google";
};

export type ModelsResponseType = {
  data: ModelType[];
};

export interface Message {
  id: string;
  content: string;
  thinkingContent?: string;
  role: "user" | "assistant";
  model?: string;
  isError?: boolean;
  loaded?: boolean;
  isThinkingLoading?: boolean;
}
