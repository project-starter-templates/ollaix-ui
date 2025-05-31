export const AVAILABLE_MODELS = {
  qwen3_4b: "Qwen3 4b",
  deepseek_r1_7b: "Deepseek R1 7b",
};

export const DEFAULT_LLM_MODEL = "qwen3_4b" as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
