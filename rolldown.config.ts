import path from 'node:path'
import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import pkg from './package.json'

const inputIndexFiles = Object.keys(pkg.exports)
  .filter((entry) => !entry.endsWith('.json'))
  .map((entry) => {
    const name = path.basename(entry)
    return [path.relative('.', `${name}/index`), path.resolve('src', `${name}/index.ts`)]
  })

export default defineConfig([
  {
    external: ['date-fns', /^date-fns\//],
    treeshake: true,
    input: Object.fromEntries(inputIndexFiles),
    output: [{ dir: 'dist', format: 'es', sourcemap: true, cleanDir: true }],
    plugins: [dts()],
  },
])
