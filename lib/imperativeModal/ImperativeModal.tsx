import type { RefObject, ReactElement } from "react";
import { useEffect, useImperativeHandle, useState, useRef } from "react";
import type { AsyncModalComponent } from "../types";
import type { ImperativeModalApi } from "./types";

interface Props<Response, Data> {
  readonly Modal: AsyncModalComponent<Response, Data>;
  readonly dismissible?: boolean;
  readonly data?: Data;
  readonly ref?: RefObject<ImperativeModalApi<Response, Data> | null>;
}

type Resolver<Response> = (result?: Response) => void;

export function ImperativeModal<Response, Data>({
  Modal,
  dismissible = true,
  data,
  ref
}: Props<Response, Data>): ReactElement {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showData, setShowData] = useState<Data>();

  const resolveRef = useRef<Resolver<Response>>(null);

  const settle = (result?: Response): void => {
    const resolve = resolveRef.current;

    resolveRef.current = null;
    resolve?.(result);
  };

  // Unmount: settle the pending promise so it does not hang
  useEffect(() => {
    return () => {
      resolveRef.current?.();
      resolveRef.current = null;
    };
  }, []);

  const handleClose = (result?: Response): void => {
    settle(result);
    setIsVisible(false);
  };

  // Ref
  useImperativeHandle(ref, () => {
    return {
      api: {
        show: async (showWith) => {
          // A new show() settles the previous one instead of leaving it pending
          settle();

          // Data passed to show() applies to this showing only
          setShowData(showWith);
          setIsVisible(true);

          return new Promise((resolve) => {
            resolveRef.current = resolve;
          });
        }
      }
    };
  });

  return (
    <Modal
      isVisible={isVisible}
      dismissible={dismissible}
      data={showData ?? data}
      onClose={handleClose}
    />
  );
}
