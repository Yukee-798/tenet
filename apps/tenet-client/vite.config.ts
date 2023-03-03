import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig((props) => {
  return {
    // build: {
    //   commonjsOptions: {

    //   },
    //   // dynamicImportVarsOptions: {
    //   //   exclude: []
    //   // }
    // },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src'),
        },
        {
          find: '@assets',
          replacement: resolve(__dirname, 'src/assets'),
        },
        {
          find: /^~antd/,
          replacement: resolve('./', 'node_modules/antd/'),
        },
      ],
    },
    plugins: [
      react(),
      // vitePluginImp({
      //   optimize: true,
      //   libList: [
      //     {
      //       libName: "antd",
      //       style: (name) => `antd/es/${name}/style`,
      //     },
      //   ],
      // }),
    ],
  };
});
