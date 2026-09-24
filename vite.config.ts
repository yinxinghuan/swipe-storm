import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  // Relative base so the bundle loads inside a Crazy Games (or Pages) iframe
  // regardless of the host path.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      // Host chrome styles stay out of the Crazy Games bundle.
      '@swipe-host-styles': path.resolve(
        __dirname,
        mode === 'crazygames'
          ? 'src/SwipeStorm/brand/empty.less'
          : 'src/SwipeStorm/brand/host.less',
      ),
    },
  },
  css: {
    preprocessorOptions: {
      less: { javascriptEnabled: true },
    },
  },
  build: {
    outDir: mode === 'crazygames' ? 'dist-crazygames' : 'dist',
    emptyOutDir: true,
  },
}));
