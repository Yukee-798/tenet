const baseConfig = require('../../prettier.config.cjs');

module.exports = Object.assign({}, baseConfig, {
  plugins: [require('prettier-plugin-tailwindcss')],
});
