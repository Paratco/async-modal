import { useContext } from "react";
import type { ModalContextType } from "../context/ModalContext";
import { ModalContext } from "../context/ModalContext";

/**
 * @deprecated Use new ref or container modal
 */
export function useAsyncModal(): ModalContextType {
  const context = useContext<ModalContextType | null>(ModalContext);

  if (context === null) {
    throw new Error("useAsyncModal must be used within a AsyncModalProvider");
  }

  return context;
}
