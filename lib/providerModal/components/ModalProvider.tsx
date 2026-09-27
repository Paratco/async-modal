import type { ReactElement, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createModalStore } from "../../core/createModalStore";
import { ModalRenderer } from "../../core/ModalRenderer";
import type { ModalDefaults } from "../../core/types";
import type { ProviderModalContext } from "../types";
import { ModalContext } from "./ModalContext";

interface Props extends Partial<ModalDefaults> {
  readonly children?: ReactNode;
}

export function ModalProvider({ children, ...defaults }: Props): ReactElement {
  // Created once per provider; never replaced
  // eslint-disable-next-line react/hook-use-state
  const [store] = useState(createModalStore);

  // Unmount: settle the open modal so its promise does not hang
  useEffect(() => {
    return () => {
      store.dismissAll();
    };
  }, [store]);

  const contextValue = useMemo<ProviderModalContext>(() => {
    return { show: store.open };
  }, [store]);

  return (
    <ModalContext value={contextValue}>
      {children}

      <ModalRenderer store={store} defaults={defaults} />
    </ModalContext>
  );
}
