module.exports = {
  parser: "babel-eslint",

  extends: ["airbnb", "prettier", "prettier/react"],

  plugins: ["prettier"],

  globals: {
    __DEV__: true,
  },

  env: {
    browser: true,
  },

  rules: {
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        jsx: "never",
        mjs: "never",
      },
    ],

    "import/no-extraneous-dependencies": "off",

    "import/prefer-default-export": "off",

    "no-console": "off",

    "no-var": "off",

    "no-shadow": "warn",

    "no-restricted-syntax": "warn",

    "no-param-reassign": "warn",

    "no-underscore-dangle": ["error", { allow: ["_id"] }],

    "no-dynamic-require": "off",

    "no-return-assign": "off",

    "arrow-body-style": "warn",

    "new-cap": "warn",

    "prefer-const": "off",

    "global-require": "off",

    "no-bitwise": "off",

    "no-continue": "off",

    "no-plusplus": "off",

    "no-redeclare": "off",

    "no-unused-vars": ["error", { varsIgnorePattern: "styles" }],

    "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx"] }],

    "react/prefer-stateless-function": "off",

    "react/prop-types": "warn",

    eqeqeq: "warn",

    "prettier/prettier": [
      "warn",
      {
        singleQuote: true,

        trailingComma: "es5",

        semi: false,

        jsxBracketSameLine: true,
      },
    ],
  },

  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src"],
      },
    },
  },
};
