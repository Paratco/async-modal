import type { ReactElement } from "react";
import { ModalRenderer } from "../../core/ModalRenderer";
import type { ModalDefaults } from "../../core/types";
import { modalStore } from "../utils/store";

export function ModalContainer(props: Partial<ModalDefaults>): ReactElement {
  return (
    <section>
      <ModalRenderer store={modalStore} defaults={props} />
    </section>
  );
}
