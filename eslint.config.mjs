import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import importX from "eslint-plugin-import-x";
import checkFile from "eslint-plugin-check-file";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "plop-templates/**",
  ]),

  // === Layer Dependency Enforcement ===
  {
    name: "boundaries/layer-rules",
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["src/**/*.ts", "src/**/*.tsx"],
      "boundaries/elements": [
        { type: "shared", pattern: ["src/shared/*"], mode: "folder" },
        { type: "entity", pattern: ["src/entity/*"], mode: "folder" },
        { type: "module", pattern: ["src/module/*/*"], mode: "folder" },
        { type: "section", pattern: ["src/section/*"], mode: "folder" },
        { type: "app", pattern: ["src/app/*"], mode: "folder" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["section", "module", "shared"] },
            { from: "section", allow: ["module", "shared"] },
            { from: "module", allow: ["entity", "shared", "module"] },
            { from: "entity", allow: ["shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],
    },
  },

  // === Circular Reference Detection ===
  {
    name: "import/no-cycle",
    plugins: { "import-x": importX },
    rules: {
      "import-x/no-cycle": "error",
    },
  },

  // === File/Folder Naming Convention ===
  {
    name: "check-file/naming",
    plugins: { "check-file": checkFile },
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/app/**"],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/**/*.tsx": "PASCAL_CASE",
          "src/module/**/*.ts": "KEBAB_CASE",
          "src/entity/**/*.ts": "KEBAB_CASE",
          "src/shared/**/*.ts": "KEBAB_CASE",
        },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/module/**/": "KEBAB_CASE",
          "src/entity/*/": "KEBAB_CASE",
          "src/section/*/": "KEBAB_CASE",
        },
      ],
    },
  },

  // === Storybook ===
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
