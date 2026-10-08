import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { aiProxyPlugin } from "./src/server/aiProxyPlugin";

export default defineConfig({
  plugins: [react(), aiProxyPlugin()],
});
