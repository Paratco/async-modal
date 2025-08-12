import { createContext } from "react";
import type { ProviderModalContext } from "../types";

export const ModalContext = createContext<ProviderModalContext | null>(null);
