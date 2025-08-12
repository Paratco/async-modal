import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { modalStore } from "../utils/store";
import getModalOptions from "../utils/getModalOptions";
import type { ContainerModalOptions } from "../types";
import { DEFAULT_OPTIONS } from "../config";

export function ModalContainer(props: Partial<ContainerModalOptions>): ReactElement {
  const storeModal = useSyncExternalStore(modalStore.subscribe, modalStore.getSnapshot);

  const [isVisible, setIsVisible] = useState<boolean>(true);

  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Unmount: Clear State
  useEffect(() => {
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const modalOptions = useMemo(() => {
    if (storeModal === null) {
      return null;
    }

    return getModalOptions({
      ...DEFAULT_OPTIONS,
      ...props
    }, storeModal.options);
  }, [props, storeModal]);

  const handleRemoveModal = (result?: unknown): void => {
    if (storeModal === null) {
      return;
    }

    if (modalOptions !== null && modalOptions.outDelay > 0) {
      setIsVisible(false);

      timeout.current = setTimeout(() => {
        storeModal.promise.resolve(result);

        modalStore.removeModal();

        setIsVisible(true);
      }, modalOptions.outDelay);

      return;
    }

    storeModal.promise.resolve(result);

    modalStore.removeModal();

    setIsVisible(true);
  };

  return (
    <section>
      {
        storeModal !== null && modalOptions !== null
          ? (
            <storeModal.modal
              isVisible={isVisible}
              dismissible={modalOptions.dismissible}
              data={modalOptions.data}
              onClose={(result?: unknown) => {
                handleRemoveModal(result);
              }}
            />
          )
          : null
      }
    </section>
  );
}
