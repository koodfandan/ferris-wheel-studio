import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf("/src/reboot/figures-v2.tsx") !== -1) {
            return "figures";
          }

          if (id.indexOf("/src/reboot/stage-v2.tsx") !== -1) {
            return "stage";
          }

          if (id.indexOf("node_modules") === -1) return;

          if (id.indexOf("/three/") !== -1) {
            return "three-core";
          }

          if (id.indexOf("@react-three/fiber") !== -1) {
            return "r3f-core";
          }

          if (id.indexOf("@react-three/drei") !== -1) {
            return "drei-core";
          }

          if (
            id.indexOf("@react-three/postprocessing") !== -1 ||
            id.indexOf("postprocessing") !== -1
          ) {
            return "postfx";
          }

          if (id.indexOf("/react/") !== -1 || id.indexOf("react-dom") !== -1) {
            return "react-stack";
          }
        },
      },
    },
  },
});
