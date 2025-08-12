import type { ContainerModalStoreItem } from "../types";

type StoreListener = () => void;

let modal: ContainerModalStoreItem<any, any> | null = null;
let listeners: StoreListener[] = [];

const emitChange = (): void => {
  for (const listener of listeners) {
    listener();
  }
};

export const modalStore = {
  // Modal Methods
  addModal: <Response, Data>(m: ContainerModalStoreItem<Response, Data>): void => {
    modal = m;

    emitChange();
  },
  removeModal: (): void => {
    modal = null;

    emitChange();
  },

  // Subscription & Snapshot
  subscribe: (listener: StoreListener): StoreListener => {
    listeners = [...listeners, listener];

    return (): void => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot: (): ContainerModalStoreItem<unknown, unknown> | null => {
    return modal;
  }
};
