/** @type {import("tailwindcss").Config} */
// eslint-disable-next-line no-undef
module.exports = {
  prefix: 't-',
  corePlugins: {
    preflight: false,
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
