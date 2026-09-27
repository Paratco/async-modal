import { createConfig } from "@paratco/eslint-config";

export default createConfig({
  platform: "react",
  style: "stylistic",
  useImport: true,
  typescript: {
    tsconfigRootDir: import.meta.dirname,
    project: "./tsconfig.json"
  },
  overrides: [
    {
      rules: {
        "@typescript-eslint/no-explicit-any": ["off"],
      }
    }
  ],
  ignores: ["dist", "eslint.config.mjs"]
});
