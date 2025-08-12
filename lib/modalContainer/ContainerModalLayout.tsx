import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { Stack } from "@mui/material";
import type { ContainerProps, ModalPropsBase } from "./type";
import ContainerModalWrapper from "./ContainerModalWrapper";
import { registerModal } from "./actionsFunction";

interface PromiseRef {
  resolve: <R>(value: R) => void;
}

export default function ContainerModalLayout<R, P extends ModalPropsBase | undefined = undefined>(): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<ContainerProps<R, P> | null>(null);

  const modalRef = useRef<PromiseRef | null>(null);

  const onClose = (result?: R): void => {
    if (modalRef.current !== null) {
      modalRef.current.resolve(result);
      setIsOpen(false);
    }

    globalThis.history.back();

    globalThis.history.pushState(null, "", globalThis.location.pathname);
    console.log(globalThis.history);
  };

  useEffect(() => {
    registerModal(async (props: ContainerProps<R, P>) => {
      return new Promise((resolve) => {
        setModalProps(props);
        setIsOpen(true);

        globalThis.history.pushState({ modal: true }, "");
        console.log(globalThis.history);

        modalRef.current = { resolve } as PromiseRef;
      });
    });
  }, []);

  useEffect(() => {
    const handleBack = (): void => {
      setIsOpen(false);

      globalThis.history.pushState(null, "", globalThis.location.pathname);

      globalThis.history.back();
    };

    if (isOpen) {
      globalThis.addEventListener("popstate", handleBack);
    }

    return () => {
      globalThis.removeEventListener("popstate", handleBack);
    };
  }, [isOpen]);

  return (
    <ContainerModalWrapper isOpen={isOpen} dismissible={modalProps?.dismissible ?? false} onClose={onClose}>
      {
        modalProps !== null
          ? (
            <modalProps.modal
              data={modalProps.data}
              isOpen={isOpen}
              dismissible={modalProps.dismissible}
              onClose={onClose}
            />
          )
          : <Stack />
      }
    </ContainerModalWrapper>
  );
}
