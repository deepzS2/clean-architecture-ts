import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'coverage'
    },
    dir: 'src',
    passWithNoTests: true,
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    silent: true
  }
})
