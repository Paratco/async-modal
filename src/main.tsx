import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
createRoot(document.querySelector("#root") as Element).render(
  <StrictMode><App /></StrictMode>
);
