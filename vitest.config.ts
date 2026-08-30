import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // Colocated tests live next to the code (src/**/*.test.ts);
    // standalone tests live in tests/.
    include: [
      'src/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
  },
})
