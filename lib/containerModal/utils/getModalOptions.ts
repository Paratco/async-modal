import type { ContainerModalOptions, ModalItemOptions } from "../types";

export default function getModalOptions<Data>(
  defaultOptions: ContainerModalOptions,
  options: Partial<ModalItemOptions<Data>> | undefined
): ModalItemOptions<Data> {
  return {
    data: options?.data,
    dismissible: options !== undefined && options.dismissible !== undefined
      ? options.dismissible
      : defaultOptions.dismissible,
    outDelay: options !== undefined && options.outDelay !== undefined
      ? options.outDelay
      : defaultOptions.outDelay
  };
}
