import type { AsyncModalComponent } from "../types";
import type { ModalItem, ModalOptions, ModalState } from "./types";

type StoreListener = () => void;

export interface ModalStore {
  open: <Response, Data>(
    modal: AsyncModalComponent<Response, Data>,
    options?: ModalOptions<Data>
  ) => Promise<Response | undefined>;
  close: (item: ModalItem<any, any>, result: unknown, outDelay: number) => void;
  dismissAll: () => void;
  subscribe: (listener: StoreListener) => () => void;
  getSnapshot: () => ModalState;
  getServerSnapshot: () => ModalState;
}

const EMPTY_STATE: ModalState = { item: null, isClosing: false };

export function createModalStore(): ModalStore {
  let state: ModalState = EMPTY_STATE;
  let listeners: StoreListener[] = [];
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;
  let closeResult: unknown;

  const setState = (next: ModalState): void => {
    state = next;

    for (const listener of listeners) {
      listener();
    }
  };

  // Resolve the current modal (with its pending close result, if any) and unmount it
  const finish = (): void => {
    const { item } = state;

    if (item === null) {
      return;
    }

    if (closeTimeout !== null) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    const result = closeResult;

    closeResult = undefined;
    setState(EMPTY_STATE);
    item.resolve(result);
  };

  return {
    open: async <Response, Data>(
      modal: AsyncModalComponent<Response, Data>,
      options?: ModalOptions<Data>
    ): Promise<Response | undefined> => {
      // Only one modal is shown at a time: settle the previous one first
      finish();

      return new Promise((resolve) => {
        setState({ item: { modal, options, resolve }, isClosing: false });
      });
    },
    close: (item: ModalItem<any, any>, result: unknown, outDelay: number): void => {
      // Ignore stale items and repeated close calls during the exit animation
      if (state.item !== item || state.isClosing) {
        return;
      }

      closeResult = result;

      if (outDelay > 0) {
        setState({ item, isClosing: true });
        closeTimeout = setTimeout(finish, outDelay);

        return;
      }

      finish();
    },
    dismissAll: finish,

    // Subscription & Snapshot
    subscribe: (listener: StoreListener): (() => void) => {
      listeners = [...listeners, listener];

      return (): void => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot: (): ModalState => {
      return state;
    },

    // No modal is ever open during server rendering and hydration
    getServerSnapshot: (): ModalState => {
      return EMPTY_STATE;
    }
  };
}
