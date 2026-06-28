import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const buildVersion = new Date().getTime().toString(); // unique timestamp for each build
  return {
    define: {
      __APP_BUILD_VERSION__: JSON.stringify(buildVersion),
    },
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'write-version-file',
        closeBundle() {
          try {
            const distDir = path.resolve(__dirname, 'dist');
            if (!fs.existsSync(distDir)) {
              fs.mkdirSync(distDir, { recursive: true });
            }
            fs.writeFileSync(path.join(distDir, 'version.txt'), buildVersion, 'utf-8');
            console.log('Successfully wrote version.txt with build ID:', buildVersion);
          } catch (e) {
            console.error('Failed to write version.txt:', e);
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
