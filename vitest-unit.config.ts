import { config } from './vitest.config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    silent: true
  }
})
