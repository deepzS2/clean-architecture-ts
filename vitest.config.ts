import { defineConfig, UserConfig } from 'vitest/config'

export const config: UserConfig = {

  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage',
      include: ["src/**/*.ts"],
      exclude: ["src/main/**", "node_modules/**"]
    },
    dir: 'src',
    exclude: ["db", "node_modules/**"],
    setupFiles: ["./vitest-mongodb-config.ts"],
    passWithNoTests: true
  }
}

export default defineConfig(config)
