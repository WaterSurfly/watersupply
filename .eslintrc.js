module.exports = {
    env: {
        node: true,
        browser: true,
        commonjs: true,
        es2021: true,
    },
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        'prettier/prettier': ['error'],
    },
};
