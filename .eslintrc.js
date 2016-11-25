module.exports = {
  extends: 'airbnb-base',
  installedESLint: true,
  plugins: [
    'import',
    'json',
  ],
  rules: {
    'no-console': "off",
    'global-require': "off",
    'import/no-dynamic-require': "off",
  },
};
