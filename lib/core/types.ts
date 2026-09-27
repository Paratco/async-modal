import type { AsyncModalComponent } from "../types";

export interface ModalDefaults {
  dismissible: boolean;
  outDelay: number;
}

export interface ModalOptions<Data> extends Partial<ModalDefaults> {
  data?: Data;
}

export interface ModalItem<Response, Data> {
  modal: AsyncModalComponent<Response, Data>;
  options?: ModalOptions<Data>;
  resolve: (result?: Response) => void;
}

export interface ModalState {
  item: ModalItem<any, any> | null;
  isClosing: boolean;
}
