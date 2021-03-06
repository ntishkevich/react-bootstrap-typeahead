module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {},
  parser: 'babel-eslint',
  plugins: [
  ],
  rules: {
    'arrow-parens': [2, 'always'],
    'comma-dangle': [2, {
      arrays: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
      imports: 'always-multiline',
      objects: 'always-multiline',
    }],
    'lines-between-class-members': [2, 'always', {
      exceptAfterSingleLine: true,
    }],
    'max-len': [1, 80, 2, {
      ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
      ignoreUrls: true,
    }],
    'no-plusplus': [2, {
      allowForLoopAfterthoughts: true,
    }],
    'no-underscore-dangle': [2, {
      allowAfterThis: true,
    }],
    'no-unused-expressions': [2, {
      allowShortCircuit: true,
      allowTernary: true,
    }],
    'no-unused-vars': [2, {
      args: 'none',
      ignoreRestSiblings: true,
    }],
    'object-curly-newline': [2, {
      consistent: true,
      multiline: true,
    }],
    'object-curly-spacing': [2, 'never'],
    'operator-linebreak': [2, 'after'],
    'react/destructuring-assignment': 0,
    'react/jsx-closing-bracket-location': [2, {
      nonEmpty: 'after-props',
      selfClosing: 'tag-aligned',
    }],
    'react/jsx-filename-extension': [2, {
      extensions: ['.js', '.jsx'],
    }],
    'react/jsx-fragments': [2, 'element'],
    'react/jsx-wrap-multilines': [2, {
      arrow: 'parens-new-line',
      assignment: 'ignore',
      condition: 'ignore',
      declaration: 'ignore',
      logical: 'ignore',
      prop: 'ignore',
      return: 'parens-new-line',
    }],
    'react/sort-comp': [2, {
      order: [
        'state',
        'instance-variables',
        'static-methods',
        'lifecycle',
        'everything-else',
        'render',
      ],
    }],
    'react/state-in-constructor': [2, 'never'],
    'sort-keys': [2, 'asc', {
      caseSensitive: false,
      natural: true,
    }],
    // eslint-disable-next-line sort-keys
    'arrow-body-style': 0,
    'import/no-webpack-loader-syntax': 0,
    'no-return-assign': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
  },
};
