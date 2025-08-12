import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useRef,
  useEffect
} from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Stack } from "@mui/material";
import type { DataResolve, ModalHandle, ModalPropsBase, PropsOpenModal } from "./types";

interface PromiseRef {
  resolve: <R>(value: R) => void;
  reject: (reason?: unknown) => void;
}

const RefModal = <R extends DataResolve<P>, P extends ModalPropsBase | undefined = undefined>():
ForwardRefExoticComponent<RefAttributes<ModalHandle<R, P>>> => {
  const component = forwardRef<ModalHandle<R, P>>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalProps, setModalProps] = useState<PropsOpenModal<R, P> | null>(null);

    const promiseRef = useRef<PromiseRef | null>(null);

    const open = useCallback(
      async (props: PropsOpenModal<R, P>): Promise<R> => {
        return new Promise<R>((resolve, reject) => {
          setModalProps(props);
          setIsOpen(true);

          globalThis.history.pushState({ modal: true }, "");

          promiseRef.current = { resolve, reject } as PromiseRef;
        });
      },
      []
    );

    const close = useCallback((result: DataResolve<P>): void => {
      if (promiseRef.current !== null) {
        promiseRef.current.resolve({
          result: result.result,
          ...result.data !== undefined ? { data: result.data } : undefined
        });
      }

      globalThis.history.back();

      globalThis.history.pushState(null, "", globalThis.location.pathname);
      console.log(globalThis.history);

      setIsOpen(false);
    }, []);

    const onClose = (result?: R): void => {
      promiseRef.current?.resolve(result);
      setIsOpen(false);

      globalThis.history.back();

      globalThis.history.pushState(null, "", globalThis.location.pathname);

      console.log(globalThis.history);
    };

    useImperativeHandle(ref, () => ({
      open,
      close
    }));

    useEffect(() => {
      const handleBack = (): void => {
        setIsOpen(false);

        globalThis.history.back();

        globalThis.history.pushState(null, "", globalThis.location.pathname);

        console.log(globalThis.history);
      };

      if (isOpen) {
        globalThis.addEventListener("popstate", handleBack);
      }

      return () => {
        globalThis.removeEventListener("popstate", handleBack);
      };
    }, [isOpen]);

    return (
      <Stack
        direction="row"
        sx={{
          padding: "20px",
          width: "100%",
          height: "100dvh",
          backgroundColor: "rgba(0,0,0,0.2)",
          position: "fixed",
          inset: 0,
          zIndex: 100,
          justifyContent: "center",
          overflowY: "auto",
          transition: "0.3s",
          ...isOpen
            ? {
              opacity: 1,
              backdropFilter: "blur(5px)",
              visibility: "visible"
            }
            : {
              opacity: 0,
              backdropFilter: "blur(0px)",
              visibility: "hidden"
            }
        }}
        onClick={() => {
          if (modalProps !== null && modalProps.dismissible) {
            onClose({
              result: false
            } as R);
          }
        }}
      >
        <Stack
          sx={{
            width: "458px",
            gap: "32px",
            backgroundColor: "background.paper",
            margin: "auto",
            padding: "24px",
            borderRadius: "30px",
            boxShadow: "0 8px 8px -4px rgba(16, 24, 40, 0.04), 0 20px 24px -4px rgba(16, 24, 40, 0.1)",
            zIndex: 1,
            transition: "0.3s",
            ...isOpen
              ? {
                opacity: 1,
                transform: "translateY(0px)"
              }
              : {
                opacity: 0,
                transform: "translateY(-30px)"
              }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {
            modalProps !== null
              ? <modalProps.modal dismissible={modalProps.dismissible} data={modalProps.data} onClose={onClose} />
              : null
          }
        </Stack>
      </Stack>
    );
  });

  component.displayName = "RefModal";

  return component;
};

export default RefModal;
