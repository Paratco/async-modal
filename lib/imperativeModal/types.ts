export interface ImperativeModalApi<Response, Data> {
  api: { show: (data?: Data) => Promise<Response | undefined> };
}
