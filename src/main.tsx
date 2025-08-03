import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
createRoot(document.querySelector("#root") as Element).render(
  <StrictMode>Use this to run a local development environment of the library for testing</StrictMode>
);
