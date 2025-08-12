import type { ComponentType } from "react";

export interface PromiseType {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export interface AsyncModalProps<Response, Data> {
  readonly isVisible: boolean;
  readonly onClose: (result?: Response) => void;
  dismissible: boolean;
  data?: Data;
}

export type AsyncModalComponent<Response, Data> = ComponentType<AsyncModalProps<Response, Data>>;
