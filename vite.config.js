import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["/src/main.jsx", "react", "react-dom"], // Add other external dependencies here.
    },
  },
});
