import { rmSync } from "node:fs";

rmSync("./dist", { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["./lib/index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "browser",
  packages: "external",
  sourcemap: "linked",
  minify: false
});

if (!result.success) {
  throw new AggregateError(result.logs, "Build failed");
}
