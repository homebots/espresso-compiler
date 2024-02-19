import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'one-var': [2, 'never'],
      'no-control-regex': [0],
      'prefer-const': [2],
      '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
    },
  }
);