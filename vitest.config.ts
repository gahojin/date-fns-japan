import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    clearMocks: true,
    environment: 'node',
    globals: true,
    benchmark: {
      include: ['src/**/*.bench.ts'],
    },
  },
})
