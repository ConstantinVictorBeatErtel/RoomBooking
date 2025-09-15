module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    // Enforce single quotes
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    
    // Enforce semicolons
    'semi': ['error', 'always'],
    
    // Enforce consistent indentation (2 spaces)
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    
    // Enforce trailing commas
    'comma-dangle': ['error', 'always-multiline'],
    
    // Enforce consistent spacing
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    
    // Enforce consistent line breaks
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    
    // Best practices
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'ignoreRestSiblings': true }],
    'no-console': 'off', // Allow console statements in development
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    
    // Arrow functions
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'arrow-parens': ['error', 'as-needed'],
    
    // Object/Array formatting
    'object-shorthand': ['error', 'always'],
    'quote-props': ['error', 'as-needed'],
    
    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Disable for now, can enable when adding TypeScript
    'react/jsx-uses-react': 'off', // Not needed in React 17+
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-wrap-multilines': ['error', {
      'declaration': 'parens-new-line',
      'assignment': 'parens-new-line',
      'return': 'parens-new-line',
    }],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
