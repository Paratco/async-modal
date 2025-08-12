import { useContext } from "react";
import type { ProviderModalContext } from "../types";
import { ModalContext } from "../components/ModalContext";

export function useProviderModal(): ProviderModalContext {
  const context = useContext<ProviderModalContext | null>(ModalContext);

  if (context === null) {
    throw new Error("useProviderModal must be used within a ModalProvider");
  }

  return context;
}
