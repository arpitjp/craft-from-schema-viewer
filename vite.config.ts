import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
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
