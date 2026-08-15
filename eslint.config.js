/**
 * ESLint Configuration File
 * Configures the linting rules to enforce code quality and consistency across the project.
 * It uses the flat config format (eslint.config.js).
 */
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [
  {
    // Specifies which files should be linted
    files: [
      "src/components/**/*.{js,mjs,cjs,jsx}",
      "src/pages/**/*.{js,mjs,cjs,jsx}",
      "src/Layout.jsx",
    ],
    
    // Folders/files to ignore during linting
    // We ignore 'ui' because it contains auto-generated/external components from shadcn/ui
    ignores: ["src/lib/**/*", "src/components/ui/**/*"],
    
    // Inherit recommended configurations
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    
    languageOptions: {
      // Defines global variables available (like window, document)
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022, // Modern JavaScript features
        sourceType: "module", // ES Modules (import/export)
        ecmaFeatures: {
          jsx: true, // Enables parsing of React JSX syntax
        },
      },
    },
    
    settings: {
      react: {
        version: "detect", // Automatically detects the React version installed
      },
    },
    
    // Define the plugins used for rule checking
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": pluginUnusedImports,
    },
    
    // Custom rule configurations
    rules: {
      // Disables standard unused vars in favor of the 'unused-imports' plugin
      "no-unused-vars": "off",
      
      // Ensures React is in scope when using JSX (legacy behavior checking, mostly safety)
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      
      // Throws errors if imports are never used, keeping the codebase clean
      "unused-imports/no-unused-imports": "error",
      
      // Allows unused variables if they start with an underscore (e.g., _event)
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      
      // Disables prop-types validation since TypeScript isn't heavily used or we rely on JS
      "react/prop-types": "off",
      
      // React 17+ doesn't require 'import React from "react"' in every JSX file
      "react/react-in-jsx-scope": "off",
      
      // Ignores specific unknown DOM properties that might be injected by third-party libraries (like Radix UI)
      "react/no-unknown-property": [
        "error",
        { ignore: ["cmdk-input-wrapper", "toast-close"] },
      ],
      
      // Enforces the Rules of Hooks (e.g., hooks must be called at the top level)
      "react-hooks/rules-of-hooks": "error",
    },
  },
];