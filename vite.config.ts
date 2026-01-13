import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: null, // 직접 만든 firebase-messaging-sw.js 등록 로직 사용
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "pwa-icon-192x192.png",
        "pwa-icon-512x512.png",
        "firebase-messaging-sw.js",
      ],
      workbox: {
        globIgnores: ["firebase-messaging-sw.js"], // FCM 워커를 캐싱에서 제외 (충돌 방지)
      },
      manifest: {
        name: "BeBee",
        short_name: "BeBee",
        description: "BeBee Progressive Web App",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        lang: "ko",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "pwa-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
