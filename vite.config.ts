import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    hmr: {
      port: 3000,
      host: 'localhost',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Ignora arquivos TypeScript e outros arquivos estáticos
        bypass: (req) => {
          // Se a requisição é para um arquivo .ts, .tsx, .js, .jsx ou .map, não faz proxy
          if (req.url && /\.(ts|tsx|js|jsx|map)$/.test(req.url)) {
            return req.url;
          }
        },
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // Ignora arquivos TypeScript
        bypass: (req) => {
          if (req.url && /\.(ts|tsx|js|jsx|map)$/.test(req.url)) {
            return req.url;
          }
        },
      },
      '/medicamentos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/clientes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/categorias': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/alertas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/estoque': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/vendas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
