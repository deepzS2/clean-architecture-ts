import { defineConfig, UserConfig } from 'vitest/config'

export const config: UserConfig = {

  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage'
    },
    setupFiles: ['node_modules/@shelf/jest-mongodb/jest-preset'],
    dir: 'src',
    passWithNoTests: true
  }
}

export default defineConfig(config)
