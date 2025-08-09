import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useRef,
  useEffect

} from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { faCircleCheck, faCircleExclamation, faCircleInfo, faCircleXmark } from "@fortawesome/pro-duotone-svg-icons";
import type { IconDefinition } from "@fortawesome/pro-duotone-svg-icons";
import type { DataResolve, ModalHandle, ModalPropsBase, PropsOpenModal } from "./types";
// import { Fai } from "lib/components";

// import { useTranslation } from "lib/base/useTranslation";
// import translations from "./locales/translations";

export type ModalAttentionVariant = "success" | "error" | "warning" | "info";

const handleIcon = (variant: ModalAttentionVariant): IconDefinition => {
  switch (variant) {
    case "error":
      return faCircleXmark;

    case "warning":
      return faCircleExclamation;

    case "info":
      return faCircleInfo;

    case "success":
      return faCircleCheck;
    default:
      return faCircleCheck;
  }
};

const handleColor = (variant: ModalAttentionVariant): string => {
  switch (variant) {
    case "error":
      return "error";

    case "warning":
      return "warning";

    case "info":
      return "info";

    case "success":
      return "success";
    default:
      return "success";
  }
};

interface PromiseRef {
  resolve: <R>(value: R) => void;
  reject: (reason?: unknown) => void;
}

const RefModal = <R extends DataResolve, P extends ModalPropsBase | undefined = undefined>():
ForwardRefExoticComponent<RefAttributes<ModalHandle<R, P>>> => {
  const component = forwardRef<ModalHandle<R, P>>((_, ref) => {
    // const { t } = useTranslation(translations);

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

    const close = useCallback((result: DataResolve): void => {
      if (promiseRef.current !== null) {
        promiseRef.current.resolve({
          result: result.result,
          ...result.data !== undefined ? { data: result.data } : undefined
        });
      }

      setIsOpen(false);
    }, []);

    const onClose = (result?: R): void => {
      promiseRef.current?.resolve(result);
      setIsOpen(false);
    };

    const confirmModal = (): void => {
      onClose({
        result: true,
        ...modalProps?.data !== undefined ? { data: modalProps.data } : undefined
      } as R);
    };

    useImperativeHandle(ref, () => ({
      open,
      close
    }));

    useEffect(() => {
      if (isOpen) {
        const handleBack = (): void => {
          onClose({
            result: false
          } as R);
        };

        globalThis.addEventListener("popstate", handleBack);

        globalThis.history.pushState(null, "", globalThis.location.pathname);

        return () => {
          globalThis.removeEventListener("popstate", handleBack);
        };
      }
    }, [isOpen]);

    // const handleTextTitle = (variant: ModalAttentionVariant): string | null => {
    //   switch (variant) {
    //     case "success":
    //       return t("confirmTitle");

    //     case "error":
    //       return t("errorTitle");

    //     case "warning":
    //       return t("warningTitle");

    //     case "info":
    //       return t("infoTitle");

    //     default:
    //       return t("confirmTitle");
    //   }
    // };

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
          onClose({
            result: false
          } as R);
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
            modalProps?.modal !== undefined
              ? <modalProps.modal dismissible={modalProps.dismissible} data={modalProps.data} onClose={onClose} />
              : (
                <>
                  <Stack
                    sx={{
                      gap: 2,
                      alignItems: "center",
                      color: `${handleColor(modalProps?.variant ?? "success")}.main`
                    }}
                  >
                    <Fai icon={handleIcon(modalProps?.variant ?? "success")} size="2x" />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: `${handleColor(modalProps?.variant ?? "success")}.main`
                      }}
                    >
                      {modalProps?.title}
                    </Typography>
                  </Stack>
                  {
                    modalProps?.subTitle !== undefined
                      ? (
                        <Typography
                          variant="body2"
                          sx={{ color: "zinc.dark", textAlign: "center" }}
                        >
                          {modalProps.subTitle}
                        </Typography>
                      )
                      : null
                  }
                  <Stack
                    direction="row"
                    sx={{
                      gap: 2,
                      justifyContent: "flex-end"
                    }}
                  >
                    {
                      modalProps?.rejectActionTitle !== undefined
                        ? (
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: `${handleColor(modalProps.variant ?? "success")}.main`
                            }}
                            onClick={() => {
                              onClose();
                            }}
                          >
                            <Typography
                              variant="button"
                              sx={{
                                color: `${handleColor(modalProps.variant ?? "success")}.main`
                              }}
                            >
                              {modalProps.rejectActionTitle}
                            </Typography>
                          </Button>
                        )
                        : null
                    }
                    <Button
                      sx={{
                        ...modalProps?.rejectActionTitle === undefined
                          ? {
                            width: 1
                          }
                          : {},
                        backgroundColor: `${handleColor(modalProps?.variant ?? "success")}.main`
                      }}
                      onClick={confirmModal}
                    >
                      <Typography
                        variant="button"
                        sx={{
                          textAlign: "center",
                          color: "#ffffff"
                        }}
                      >
                        {modalProps?.acceptActionTitle}
                      </Typography>
                    </Button>
                  </Stack>
                </>
              )
          }
        </Stack>
      </Stack>
    );
  });

  component.displayName = "RefModal";

  return component;
};

export default RefModal;
