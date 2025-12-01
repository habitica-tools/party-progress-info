import path from 'node:path';

/* eslint import-x/no-extraneous-dependencies: ['error', {'devDependencies': true}] */

import { configs, plugins } from 'eslint-config-airbnb-extended';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';

const gitignorePath = path.resolve('.', '.gitignore');

const jsConfig = [
    // ESLint Recommended Rules
    {
        name: 'js/config',
        ...js.configs.recommended,
    },
    // Stylistic Plugin
    plugins.stylistic,
    // Import X Plugin
    plugins.importX,
    // Airbnb Base Recommended Config
    ...configs.base.recommended,
];

const nodeConfig = [
    // Node Plugin
    plugins.node,
    // Airbnb Node Recommended Config
    ...configs.node.recommended,
];

export default [
    // Ignore .gitignore files/folder in eslint
    includeIgnoreFile(gitignorePath),
    // Javascript Config
    ...jsConfig,
    // Node Config
    ...nodeConfig,
];
