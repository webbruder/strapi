module.exports = {
  root: true,
  extends: ['custom/front/typescript', 'plugin:storybook/recommended'],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    'import/no-unresolved': [
      'error',
      {
        // Eslint does not detect the package.json exports field
        // and reports broken imports for the following imports
        ignore: ['@strapi/design-system/v2'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.eslint.json',
      },
    },
  },
  overrides: [
    {
      files: ['./jest.config.front.js', './webpack.config.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['./tests/*'],
      env: {
        jest: true,
      },
    },
    {
      // https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      files: ['*.ts', '*.tsx'],
      env: {
        jest: true,
      },
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
