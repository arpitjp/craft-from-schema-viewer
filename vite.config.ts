import { defineConfig, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

/**
 * protodef's compiler.compile() does:
 *   const native = this.native;
 *   return eval(code)();
 *
 * The eval'd code references `native` as a local variable name.
 * Every JS minifier either renames it or dead-code-eliminates the
 * assignment, causing "ReferenceError: native is not defined" at runtime.
 *
 * Fix: rewrite the compile method to assign `native` as a property on
 * `globalThis` before eval, then clean it up. This survives minification.
 */
function fixProtodefNative(): Plugin {
  return {
    name: "fix-protodef-native",
    transform(code, id) {
      if (!id.includes("protodef") || !id.includes("compiler")) return null;

      const patched = code.replace(
        /compile\s*\(\s*code\s*\)\s*\{[\s\S]*?const\s+native\s*=\s*this\.native[\s\S]*?return\s+eval\(code\)\(\)[\s\S]*?\}/,
        `compile(code) {
    const __native = this.native;
    const { PartialReadError } = require('./utils');
    const fn = new Function('native', 'PartialReadError', 'return ' + code);
    return fn(__native, PartialReadError)();
  }`,
      );
      if (patched === code) return null;
      return { code: patched, map: null };
    },
  };
}

export default defineConfig({
  plugins: [
    fixProtodefNative(),
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
        manualChunks(id) {
          if (id.includes("prismarine-nbt") || id.includes("protodef")) {
            return "nbt";
          }
        },
      },
    },
    cssCodeSplit: false,
  },
});
