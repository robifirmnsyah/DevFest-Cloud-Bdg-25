import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Ensure HTTPS headers for PWA (optional but recommended for production)
    headers: {
      "Service-Worker-Allowed": "/",
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // PWA Development Setup
  define: {
    __PWA_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
  build: {
    // Ensure manifest.json is copied to dist
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'manifest.json') {
            return 'manifest.json';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
}));
