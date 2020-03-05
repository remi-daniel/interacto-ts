module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: "tsconfig.json",
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint'
    ],
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],

    "rules": {
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/array-type": ["error", { "default": "generic"}],
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/explicit-member-accessibility": ["error", { "accessibility": "explicit" }],
      "@typescript-eslint/prefer-for-of": "error",
      //"@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/class-name-casing": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
        
      "@typescript-eslint/indent": ["error", 4, {
          "FunctionDeclaration": { "parameters": "first" },
          "FunctionExpression": { "parameters": "first" }
      }],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-parameter-properties": "error",
      "@typescript-eslint/no-implied-eval": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-arguments": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/no-type-alias": "error",
      "@typescript-eslint/no-throw-literal": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-extraneous-class": "error",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-dynamic-delete": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/prefer-nullish-coalescing": ["error", 
        {"ignoreMixedLogicalExpressions" : false, "ignoreConditionalTests": false}],
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/quotes": [
          "error",
          "double"
      ],
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/unified-signatures": "error",
      "arrow-parens": ["error", "as-needed"],
      "camelcase": "error",
      "complexity": ["error", { "max": 10 }],
      "constructor-super": "error",
      "curly": "error",
      "dot-notation": "error",
      "eol-last": "error",
      "eqeqeq": ["error", "smart"],
      "guard-for-in": "error",
      "id-match": "error",
      "max-len": ["error", { "code": 150 }],
      "new-parens": "error",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-cond-assign": "error",
      "no-debugger": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "no-eval": "error",
      "no-irregular-whitespace": "error",
      "no-multiple-empty-lines": ["error", { "max": 2 }],
      "no-new-wrappers": "error",
      "no-redeclare": "error",
      "no-restricted-syntax": ["error", "ForInStatement"],
      "no-return-await": "error",
      "no-sequences": "error",
      "no-shadow": ["error", { "hoist": "all" }],
      "no-sparse-arrays": "error",
      "no-template-curly-in-string": "error",
      "no-trailing-spaces": "error",
      "no-undef-init": "error",
      "no-unsafe-finally": "error",
      "no-unused-labels": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      "prefer-object-spread": "error",
      "radix": "error",
      "yoda": "error",
    }
};
