import type { ComponentType } from "react";

export type ModalPropsBase = Record<string, unknown>;

export interface DefaultContainerModalProps<R, P extends ModalPropsBase | undefined = undefined> {
  readonly onClose: (result?: R) => void;
  data?: P;
  isOpen?: boolean;
  dismissible: boolean;
}

export interface ContainerProps<R,
  P extends ModalPropsBase | undefined = undefined> {

  modal: ComponentType<DefaultContainerModalProps<R, P>>;
  data?: P;
  dismissible: boolean;

  // readonly onClose: (result?: R) => void;
}
