import { defineConfig, UserConfig } from 'vitest/config'

export const config: UserConfig = {

  test: {
    coverage: {
      reporter: ['text', 'json', 'html', 'lcovonly'],
      reportsDirectory: 'coverage',
      include: ["src/**/*.ts"],
      exclude: ["src/main/**", "node_modules/**"]
    },
    dir: 'src',
    exclude: ["data", "node_modules/**"],
    setupFiles: ["./vitest-mongodb-config.ts"],
    passWithNoTests: true
  }
}

export default defineConfig(config)
