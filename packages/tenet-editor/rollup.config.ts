import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import postcss from 'rollup-plugin-postcss';
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
  input: './index.tsx',
  output: {
    file: 'dist/index.js',
    format: 'esm', // 使用 esm 打包输出，便于 vite 识别
  },
  plugins: [
    del({ targets: 'dist/*' }), // 删除 dist 目录下的所有文件
    postcss({
      extract: true, // 将 CSS 文件提取到单独的文件中
      minimize: true, // 压缩 CSS 文件
      sourceMap: true, // 生成 source map 文件
      extensions: ['.css'], // 处理的文件扩展名
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
  ],
  watch: {
    include: ['**/*.ts', '**/*.tsx', '**/*.css', 'postcss.config.cjs', 'tailwind.config.cjs'],
  },
  external: ['react', 'react-dom'],
};

export default config;
