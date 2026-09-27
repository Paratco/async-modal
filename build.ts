import type { BuildConfig } from "bun";

const config: BuildConfig = {
  entrypoints: ["./lib/index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "browser",
  packages: "external",
  sourcemap: "linked",
  minify: false
};

const result = await Bun.build(config);

if (!result.success) {
  throw new AggregateError(result.logs, "Build failed");
}
