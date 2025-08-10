import type { ComponentType } from "react";

export interface PropsOpenModal<R, P extends ModalPropsBase | undefined = undefined> {
  dismissible: boolean;
  modal: ComponentType<DefaultRefModalProps<R, P>>;
  data?: P;
}

export interface DataResolve {
  result: boolean;
  data?: unknown;
}

export type ModalPropsBase = Record<string, unknown>;

export interface DefaultRefModalProps<R, P extends ModalPropsBase | undefined = undefined> {
  dismissible: boolean;
  readonly onClose: (result?: R) => void;
  data?: P;
}

export interface ModalHandle<R, P extends ModalPropsBase | undefined = undefined> {
  open: (props: PropsOpenModal<R, P>) => Promise<R>;
  close: (result: DataResolve) => void;
}
