import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        websiteDevelopment: resolve(__dirname, 'website-development.html'),
        landingPageDesign: resolve(__dirname, 'landing-page-design.html'),
        uiUxDesign: resolve(__dirname, 'ui-ux-design.html'),
      },
    },
  },
});
