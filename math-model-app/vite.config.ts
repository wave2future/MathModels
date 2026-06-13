import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "favicon.svg"],
      manifest: {
        name: "MathModels - Interactive Math Visualizer",
        short_name: "MathModels",
        description:
          "Explore predefined, interactive math models: functions, plane curves, solid geometry and combined solids.",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        start_url: "./",
        scope: "./",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: {
        // Cache static model data and assets for offline usage.
        globPatterns: ["**/*.{js,css,html,svg,woff,woff2,ttf,png,ico}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // Relative base so the build works on web, inside Tauri, and inside a Capacitor webview.
  base: "./",
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy vendors so the 3D engine and math typesetting load as
        // separate cacheable chunks instead of one giant bundle.
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
          katex: ["katex"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
  },
});
