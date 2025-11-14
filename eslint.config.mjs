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
        }
    }
])
