const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  root: __dirname,
  // Listen on IPv4 + IPv6 so http://127.0.0.1:5173 works (not only localhost → ::1).
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "../generated-client"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
