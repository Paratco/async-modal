import type { AsyncModalComponent } from "../../types";
import type { ModalItemOptions } from "../types";
import { modalStore } from "./store";

async function add<Response, Data>(
  modal: AsyncModalComponent<Response, Data>,
  options?: Partial<ModalItemOptions<Data>>
): Promise<Response | undefined> {
  return new Promise((resolve, reject) => {
    modalStore.addModal({
      modal: modal,
      promise: { resolve, reject },
      options: options
    });
  });
}

export const modal = {
  add
};
