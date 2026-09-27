import { useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import type { ModalStore } from "./createModalStore";
import type { ModalDefaults } from "./types";

interface Props {
  readonly store: ModalStore;
  readonly defaults?: Partial<ModalDefaults>;
}

export function ModalRenderer({ store, defaults }: Props): ReactElement | null {
  const { item, isClosing } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  if (item === null) {
    return null;
  }

  const dismissible = item.options?.dismissible ?? defaults?.dismissible ?? true;
  const outDelay = item.options?.outDelay ?? defaults?.outDelay ?? 0;

  return (
    <item.modal
      isVisible={!isClosing}
      dismissible={dismissible}
      data={item.options?.data as unknown}
      onClose={(result?: unknown) => {
        store.close(item, result, outDelay);
      }}
    />
  );
}
