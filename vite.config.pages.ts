// GitHub Pages 专用构建配置：react/react-dom/react-router/lucide 走 importmap CDN，
// 课程正文与图解按需分包，保证每个产物文件可经 API 推送。
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist-pages"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client", "react-router", "lucide-react"],
    },
  },
});
