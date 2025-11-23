import stylistic from "@stylistic/eslint-plugin";
import preactConfig from "eslint-config-preact";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        extends: [preactConfig],
    },
    {
        ignores: [
            "dist/**",
            "node_modules/**",
        ],
    },
    {
        plugins: {
            "@stylistic": stylistic,
        },
    },
    {
        files: ["./*.js"],
        rules: {
            "@stylistic/indent": ["error", 4],
        }
    },
    {
        files: ["./src/**/*.js"],
        rules: {
            "@stylistic/indent": ["error", 2],
            "object-shorthand": ["warn", "never"],
            "radix": ["warn", "as-needed"],
            "react/jsx-no-bind": ["warn", { "allowBind": true }],

            // disable rules that conflict with the current code style
            "react/self-closing-comp": ["off"],
            "react/no-did-mount-set-state": ["off"],
            "react/jsx-key": ["off"],
            "no-var": ["off"],
            "prefer-template": ["off"],
            "prefer-arrow-callback": ["off"],
            "no-else-return": ["off"],
            "no-unused-vars": ["off"],
        }
    }
])
