import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'pnpm-workspace.yaml',
    'drizzle',
    'docs',
  ],
})
