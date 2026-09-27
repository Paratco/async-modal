import type { AsyncModalComponent } from "../../types";
import type { ModalOptions } from "../../core/types";
import { modalStore } from "./store";

async function add<Response, Data>(
  modal: AsyncModalComponent<Response, Data>,
  options?: ModalOptions<Data>
): Promise<Response | undefined> {
  return modalStore.open(modal, options);
}

export const modal = {
  add
};
