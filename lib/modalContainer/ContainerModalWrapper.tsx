import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { DefaultContainerModalProps } from "./type";

interface ContainerProps {
  readonly children: ReactElement;
}

export default function ContainerModalWrapper<R>(
  { isOpen, dismissible, onClose, children }: ContainerProps & DefaultContainerModalProps<R>
): ReactElement {
  const [open, setOpen] = useState<boolean>(isOpen ?? false);

  const handleClose = (): void => {
    if (dismissible) {
      onClose({ result: false } as R);
    }
  };

  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  return (
    <Stack
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(5px)",
        transition: "0.3s",
        p: 3,
        overflowY: "auto",
        zIndex: 100,
        ...open
          ? {
            opacity: 1,
            visibility: "visible"
          }
          : {
            opacity: 0,
            visibility: "hidden"
          }
      }}
      onClick={handleClose}
    >
      <Stack
        sx={{
          backgroundColor: "background.paper",
          borderRadius: "30px",
          margin: "auto",
          width: "458px",
          boxShadow: "0 8px 8px -4px rgba(16, 24, 40, 0.04), 0 20px 24px -4px rgba(16, 24, 40, 0.1)",
          transition: "0.3s",
          p: 3,
          ...open
            ? {
              transform: "translateY(0)"
            }
            : {
              transform: "translateY(-30px)"
            }
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
