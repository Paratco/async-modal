import type { AsyncModalComponent } from "../types";
import type { ModalOptions } from "../core/types";

export interface ProviderModalContext {
  show: <Response, Data>(
    modal: AsyncModalComponent<Response, Data>,
    options?: ModalOptions<Data>
  ) => Promise<Response | undefined>;
}
