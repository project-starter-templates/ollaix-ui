import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { ApiService } from "@/services/apiService";
import type { ModelType } from "@/utils/types";

export const ModelContext = createContext<ModelType[]>([]);

export function ModelContextProvider({ children }: PropsWithChildren) {
  const [models, setModels] = useState<ModelType[]>([]);

  useEffect(() => {
    new ApiService().getModels(setModels);
  }, []);

  return <ModelContext value={models}>{children}</ModelContext>;
}
