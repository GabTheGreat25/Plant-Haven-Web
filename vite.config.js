import { defineConfig } from "vite";
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from "url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcPath,
      "@assets": `${srcPath}/assets`,
      "@components": `${srcPath}/components`,
      "@layouts": `${srcPath}/layouts`,
    },
  },
  server: {
    port: 6969,
  },
});
