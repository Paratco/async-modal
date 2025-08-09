import type { ComponentType } from "react";
import type { ModalAttentionVariant } from "./RefModal";

export interface PropsOpenModal<R, P extends ModalPropsBase | undefined = undefined> {
  title?: string;
  subTitle?: string;
  variant?: ModalAttentionVariant;
  acceptActionTitle?: string;
  dismissible: boolean;
  rejectActionTitle?: string;
  modal?: ComponentType<DefaultModalAnimationProps<R, P>>;
  data?: P;
}

export interface DataResolve {
  result: boolean;
  data?: unknown;
}

export type ModalPropsBase = Record<string, unknown>;

export interface DefaultModalAnimationProps<R, P extends ModalPropsBase | undefined = undefined> {
  dismissible: boolean;
  readonly onClose: (result?: R) => void;
  data?: P;
}

export interface ModalHandle<R, P extends ModalPropsBase | undefined = undefined> {
  open: (props: PropsOpenModal<R, P>) => Promise<R>;
  close: (result: DataResolve) => void;
}
