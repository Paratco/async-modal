import type { AsyncModalComponent, PromiseType } from "../types";

export interface ModalOptions<Data> {
  dismissible?: boolean;
  outDelay?: number;
  data?: Data;
}

export interface ProviderModalItem<Response, Data> {
  modal: AsyncModalComponent<Response, Data>;
  promise: PromiseType;
  options?: ModalOptions<Data>;
}

export interface ProviderModalContext {
  show: <Response, Data>(
    modal: AsyncModalComponent<Response, Data>,
    options?: ModalOptions<Data>
  ) => Promise<Response | undefined>;
}

export interface ProviderModalOptions {
  dismissible: boolean;
  outDelay: number;
}
