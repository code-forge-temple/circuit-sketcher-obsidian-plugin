import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslintParser,
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "max-len": ["error", { code: 250 }],
      indent: ["error", 4, { SwitchCase: 1 }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-trailing-spaces": "error", // Disallow trailing spaces
      "no-multi-spaces": "error", // Disallow multiple spaces
      "no-irregular-whitespace": "error", // Disallow irregular whitespace
      "space-in-parens": ["error", "never"], // Enforce spacing inside parentheses
      "space-before-function-paren": ["error", "always"], // Enforce spacing before function parenthesis
      "comma-spacing": ["error", { before: false, after: true }], // Enforce spacing after commas
      "object-curly-spacing": ["error", "never"], // Enforce spacing inside curly braces
    },
  }
);
