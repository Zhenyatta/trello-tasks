module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'prefer-const': ['error', {
            destructuring: 'all',
            ignoreReadBeforeAssign: true
        }],
        quotes: ['error', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],
        semi: ['error', 'always'],
        curly: ['error', 'all'],
    }
};
