import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: process.env.RUN_LIVE === "1" ? [] : ["src/**/*.live.test.ts"],
  },
});
