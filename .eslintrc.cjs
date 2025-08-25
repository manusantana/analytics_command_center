module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'no-case-declarations': 'off',
        'no-unsafe-optional-chaining': 'off',
        'no-inner-declarations': 'off',
        'react/no-unescaped-entities': 'off',
    },
};