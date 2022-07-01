module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'google',
    ],
    rules: {
        'quotes': ['error', 'single'],
        'indent': ['error', 4],
        'object-curly-spacing': [2, 'always'],
        'max-len': ['error', { 'code': 150 }],
        'require-jsdoc': 0,
    },
    parserOptions: {
        'sourceType': 'module',
    },
};
