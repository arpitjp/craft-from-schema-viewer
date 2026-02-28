import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    nodePolyfills({ include: ["buffer", "zlib", "assert", "stream", "util"] }),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CraftFromSchemaViewer",
      formats: ["es", "cjs"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["three"],
      output: {
        globals: { three: "THREE" },
      },
    },
    cssCodeSplit: false,
  },
});
