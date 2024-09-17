import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pkg from 'eslint-config-prettier';
const { rules } = pkg;
import parser from '@typescript-eslint/parser';


export default [
  {
  files: ["./src/**/*.{js,mjs,cjs,ts}"],
  languageOptions: {
      globals: { ...globals.browser, ...globals.node },  // Use browser and node globals
      parser,  // Set TypeScript parser
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      ...rules,
      "no-unused-vars": "off",
      "no-undef": "off",
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      eqeqeq: 'error',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
      indent: ['warn', 2],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-unused-expressions': 'error',
      'no-unneeded-ternary': 'warn',
      'array-callback-return': 'warn',
      'new-cap': ['error', { newIsCap: true }],
      'max-len': ['warn', { code: 200 }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];