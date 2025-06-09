export const AVAILABLE_MODELS = {
  "gemini-2.0-flash": "Gemini 2.0 Flash",
  "qwen3:4b": "Qwen3 4b",
  "deepseek-r1:7b": "Deepseek R1 7b",
};

export const DEFAULT_LLM_MODEL = "qwen3:4b" as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
