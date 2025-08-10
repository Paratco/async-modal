import type { ContainerProps, ModalPropsBase } from "./type";

export type ShowComponentFn = <
  R,
  P extends ModalPropsBase | undefined = undefined
>(
  props: ContainerProps<R, P>
) => Promise<R>;

// eslint-disable-next-line import-x/no-mutable-exports
export let showComponent: ShowComponentFn | null = null;

export function registerModal(fn: ShowComponentFn): void {
  showComponent = fn;
}

export async function showModalContainer<
  R,
  P extends ModalPropsBase | undefined = undefined
>(props: ContainerProps<R, P>): Promise<R> {
  if (showComponent !== null) {
    return showComponent(props);
  }

  console.warn("ModalManager not mounted yet.");

  return false as R;
}
