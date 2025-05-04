/// <reference types="vite/client" />
declare module '@tailwindcss/vite' {
  import type { Plugin } from 'vite';
  const tailwindcss: () => Plugin[];
  export default tailwindcss;
}

declare module '@vitejs/plugin-react-swc' {
  import type { Plugin } from 'vite';
  const react: () => Plugin;
  export default react;
}
