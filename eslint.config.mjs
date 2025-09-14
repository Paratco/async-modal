import { createConfig } from "@paratco/eslint-config";

export default createConfig({
  platform: "react",
  style: "stylistic",
  useImport: true,
  typescript: {
    tsconfigRootDir: import.meta.dirname,
    project: "./tsconfig.app.json"
  },
  overrides: [
    {
      rules: {
        "import-x/no-extraneous-dependencies": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
      }
    }
  ],
  ignores: ["dist", "vite.config.ts", "eslint.config.mjs", "src/vite-env.d.ts", "lib/vite-env.d.ts"]
});
