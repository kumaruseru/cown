module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    'no-array-constructor': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-new-object': 'error',
    'no-prototype-builtins': 'error',
    'no-iterator': 'error',
    'dot-notation': 'error',
    'one-var': ['error', 'never'],
    'no-multi-assign': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'eqeqeq': ['error', 'always'],
    'no-case-declarations': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'no-mixed-operators': 'error',
    'nonblock-statement-body-position': ['error', 'beside'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'no-else-return': 'error',
    'spaced-comment': ['error', 'always'],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'keyword-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'no-param-reassign': ['error', { props: false }],
    'prefer-rest-params': 'error',
    'no-new-func': 'error',
    'space-in-parens': ['error', 'never'],
    'no-confusing-arrow': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'no-useless-constructor': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'import/no-mutable-exports': 'error',
    'import/prefer-default-export': 'off',
    'import/first': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'generator-star-spacing': 'error',
    'dot-location': ['error', 'property'],
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated'
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.'
      }
    ],
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'always'],
    'radix': 'error',
    'id-length': ['error', { exceptions: ['i', 'j', 'k', '_', 'e', 'x', 'y'] }],
    'new-cap': ['error', {
      newIsCap: true,
      newIsCapExceptions: [],
      capIsNew: false,
      capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List']
    }]
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
};
