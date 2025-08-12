import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ModalOptions,
  ProviderModalContext, ProviderModalItem,
  ProviderModalOptions
} from "../types";
import type { AsyncModalComponent } from "../../types";
import { DEFAULT_OPTIONS } from "../config";
import { ModalContext } from "./ModalContext";

interface Props extends Partial<ProviderModalOptions> {
  readonly children: ReactElement;
}

export function ModalProvider<Response, Data>({
  children,
  ...props
}: Props): ReactElement {
  const [renderModal, setRenderModal] = useState<ProviderModalItem<Response, Data> | null>(null);
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
    if (renderModal === null) {
      return null;
    }

    return {
      ...DEFAULT_OPTIONS,
      ...props,
      ...renderModal.options
    };
  }, [props, renderModal]);

  const handleClose = (result?: Response): void => {
    if (renderModal === null) {
      return;
    }

    if (modalOptions !== null && modalOptions.outDelay > 0) {
      setIsVisible(false);

      timeout.current = setTimeout(() => {
        renderModal.promise.resolve(result);

        setRenderModal(null);
        setIsVisible(true);
      }, modalOptions.outDelay);

      return;
    }

    renderModal.promise.resolve(result);

    setRenderModal(null);
    setIsVisible(true);
  };

  const memValue = useMemo(() => {
    return {
      show: async (
        modal: AsyncModalComponent<Response, Data>,
        options?: ModalOptions<Data>
      ): Promise<Response | undefined> => {
        return new Promise((resolve, reject) => {
          setRenderModal({
            modal,
            options,
            promise: { resolve, reject }
          });
        });
      }
    } as ProviderModalContext;
  }, []);

  return (
    <ModalContext.Provider value={memValue}>
      {children}

      {
        renderModal !== null && modalOptions !== null
          ? (
            <renderModal.modal
              isVisible={isVisible}
              dismissible={modalOptions.dismissible}
              data={modalOptions.data}
              onClose={handleClose}
            />
          )
          : null
      }
    </ModalContext.Provider>
  );
}
