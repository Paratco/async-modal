import type { AsyncModalComponent, PromiseType } from "../types";

export interface ModalItemOptions<Data> {
  dismissible: boolean;
  outDelay: number;
  data?: Data;
}

export interface ContainerModalStoreItem<Response, Data> {
  modal: AsyncModalComponent<Response, Data>;
  promise: PromiseType;
  options?: Partial<ModalItemOptions<Data>>;
}

export interface ContainerModalOptions {
  dismissible: boolean;
  outDelay: number;
}
