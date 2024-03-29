import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [
      react(),
      eslintPlugin({
        cache: false,
        include: ["./src/**/*.js", "./src/**/*.jsx"],
        exclude: [],
      }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
          // NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const isModule = id.includes("node_modules");
            if (isModule && id.includes("@solana")) {
              return "vendor_solana";
            }
            if (isModule && id.includes("@project-serum")) {
              return "vendor_anchor";
            }
            if (isModule && id.includes("@tanstack")) {
              return "vendor_tanstack";
            }
          },
        },
      },
    },
    // resolve: {
    //   alias: [
    //     {
    //       find: "stream",
    //       replacement: `stream-browserify`,
    //     },
    //   ],
    // },
    server: {
      port: 9933,
    },
  };
});
