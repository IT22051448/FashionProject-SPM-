import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  { languageOptions: { globals: {...globals.browser, process: "readonly"} } },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    // extends: ["plugin:prettier/recommended"],
  },
];
