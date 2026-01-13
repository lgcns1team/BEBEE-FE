import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: null,
      registerType: "autoUpdate",
      // Firebase 서비스 워커를 제외하도록 설정하거나,
      // 직접 만든 sw.js를 PWA 워커로 사용하려면 모드 변경이 필요합니다.
      workbox: {
        // public에 있는 firebase-messaging-sw.js를
        // PWA의 캐싱 대상에서 제외하여 충돌 방지
        globIgnores: ["firebase-messaging-sw.js"],
      },
      manifest: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
