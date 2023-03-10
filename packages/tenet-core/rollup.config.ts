import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  input: './index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm', // 使用 esm 打包输出，便于 vite 识别
  },
  plugins: [
    // del({ targets: 'dist/*' }), // 删除 dist 目录下的所有文件
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
    }),
  ],
  watch: {
    include: ['**/*.ts'],
  },
  external: ['react'],
};

export default config;
