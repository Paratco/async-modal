import type { AsyncModalComponent } from "../types";

export interface ImperativeModalApi<Response, Data> {
  api: { show: (data?: Data) => Promise<Response | undefined> };
}

export type ImperativeModalRef<T> = T extends AsyncModalComponent<infer Response, infer Data>
  ? ImperativeModalApi<Response, Data> : never;
