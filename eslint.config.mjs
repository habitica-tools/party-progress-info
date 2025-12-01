import { defineConfig } from 'eslint/config';
import preactConfig from 'eslint-config-preact';

// eslint-disable-next-line import-x/extensions
import airbnbConfig from './airbnb.config.mjs';

export default defineConfig([
    {
        extends: [airbnbConfig, preactConfig],
    },
    {
        files: ['./**/*.*(m)js'],
        rules: {
            // adjustments to the AirBnB code style
            'object-shorthand': ['error', 'consistent'],

            '@stylistic/brace-style': ['error', 'stroustrup', {
                'allowSingleLine': true,
            }],
            '@stylistic/function-paren-newline': ['error', 'consistent'],
            '@stylistic/linebreak-style': ['off'],
            '@stylistic/lines-between-class-members': ['error', 'always', {
                'exceptAfterSingleLine': true,
            }],
            '@stylistic/max-len': ['off'],
            '@stylistic/operator-linebreak': ['error', 'after', {
                'overrides': {
                    '?': 'none',
                    ':': 'none',
                    '&&': 'ignore',
                    '||': 'ignore',
                },
            }],
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/semi': ['off'],

            // additional style rules
            'sort-imports': ['warn', {
                'allowSeparatedGroups': true,
            }],

            '@stylistic/jsx-quotes': ['error', 'prefer-double'],
        },
    },
    {
        files: ['./*.*(m)js'],
        rules: {
            '@stylistic/indent': ['warn', 4],
            '@stylistic/quote-props': ['warn', 'consistent'],
        },
    },
    {
        files: ['./src/**/*.js'],
        rules: {
            '@stylistic/indent': ['warn', 2],

            'radix': ['warn', 'as-needed'],
            'react/jsx-no-bind': ['warn', { 'allowBind': true }],

            // disable rules that conflict with the current code style
            'react/self-closing-comp': ['off'],
            'react/no-did-mount-set-state': ['off'],
            'react/jsx-key': ['off'],
            'prefer-template': ['off'],
            'prefer-arrow-callback': ['off'],
            'no-else-return': ['off'],
            'no-unused-vars': ['off'],
        },
    },
]);
