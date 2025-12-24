// @ts-check

import { config as baseConfig } from "@repo/config/eslint-base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ["src/generated/**"],
  },
];
