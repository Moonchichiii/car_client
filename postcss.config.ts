import tailwindPlugin from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default {
  plugins: [tailwindPlugin(), autoprefixer(), postcssNesting()],
};
