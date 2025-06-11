import { use } from "react";
import { ModelContext } from "@/context/ModelContext";

export function useModels() {
  return use(ModelContext);
}
