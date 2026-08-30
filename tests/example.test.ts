// Scaffold example — delete this file once you start writing real tests.
//
// Pattern:
//   import { describe, expect, it } from 'vitest'
//   - Colocated tests:      src/foo.test.ts  (next to the code under test)
//   - Standalone tests:     tests/bar.test.ts
//   - Run once:             pnpm run test
//   - Watch mode:           pnpm run test:watch
//
// Note: vitest runs with `--passWithNoTests`, so CI stays green even with
// no test files; the moment you add tests they are executed automatically.

import { describe, expect, it } from 'vitest'

function add(a: number, b: number) {
  return a + b
}

describe('example', () => {
  it('adds numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})
