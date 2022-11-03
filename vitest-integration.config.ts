import { defineConfig } from 'vitest/config'
import { config } from './vitest.config'

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    silent: true
  }
})
