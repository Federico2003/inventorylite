import { defineConfig } from "vitest/config";

// Pruebas de aceptación (UAT) contra una URL ya desplegada.
// Uso: UAT_BASE_URL=https://... npm run test:uat
export default defineConfig({
  test: {
    environment: "node",
    include: ["uat/**/*.test.ts"],
    testTimeout: 20000,
    reporters: ["default", "junit"],
    outputFile: { junit: "./reports/junit-uat.xml" },
  },
});
