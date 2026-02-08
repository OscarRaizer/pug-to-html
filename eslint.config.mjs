import vue from "eslint-plugin-vue"
import unicorn from "eslint-plugin-unicorn"
import vueParser from "vue-eslint-parser"

export default [
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue,
      unicorn,
    },
    rules: {
      ...vue.configs["flat/recommended"].rules,
      ...unicorn.configs.recommended.rules,
    },
  },

  {
    files: ["**/*.js"],
    plugins: {
      unicorn,
    },
    rules: {
      ...unicorn.configs.recommended.rules,
    },
  },
]
