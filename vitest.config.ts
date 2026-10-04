import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Config separada de vite.config.ts para no cargar el plugin de Cloudflare en los tests
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}", "worker/**/*.ts"],
      exclude: ["src/main.tsx", "src/types.ts"],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
