import type { RefObject, ReactElement } from "react";
import { useMemo, useImperativeHandle, useState, useRef } from "react";
import type { AsyncModalComponent, PromiseType } from "../types";
import type { ImperativeModalApi } from "./types";

interface Props<Response, Data> {
  readonly Modal: AsyncModalComponent<Response, Data>;
  readonly dismissible?: boolean;
  readonly data?: Data;
  readonly ref?: RefObject<ImperativeModalApi<Response, Data> | null>;
}

export function ImperativeModal<Response, Data>({
  Modal,
  dismissible = true,
  data,
  ref
}: Props<Response, Data>): ReactElement {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [additionalData, setAdditionalData] = useState<Data | null>(null);

  const promiseRef = useRef<PromiseType>(null);

  const handleClose = (result?: Response): void => {
    if (promiseRef.current !== null) {
      promiseRef.current.resolve(result);
    }

    promiseRef.current = null;
    setIsVisible(false);
  };

  // Ref
  useImperativeHandle(ref, () => {
    return {
      api: {
        show: async (ad) => {
          if (ad !== undefined) {
            setAdditionalData(ad);
          }

          setIsVisible(true);

          return new Promise((resolve, reject) => {
            promiseRef.current = { resolve, reject };
          });
        }
      }
    };
  });

  const dataProps: Data | undefined = useMemo(() => {
    if (additionalData !== null) {
      return additionalData;
    }

    return data;
  }, [additionalData, data]);

  return (
    <Modal isVisible={isVisible} dismissible={dismissible} data={dataProps} onClose={handleClose} />
  );
}
