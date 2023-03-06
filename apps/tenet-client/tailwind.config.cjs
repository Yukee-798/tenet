/** @type {import("tailwindcss").Config} */
module.exports = {
  prefix: 't-',
  corePlugins: {
    preflight: false,
  },
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tenet/editor/**/*.{jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
