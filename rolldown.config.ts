import path from 'node:path'
import { defineConfig } from 'rolldown'
import IsolatedDecl from 'unplugin-isolated-decl/rolldown'
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
    output: [
      { dir: 'dist', format: 'esm', entryFileNames: '[name].mjs', sourcemap: true, cleanDir: true },
      { dir: 'dist', format: 'cjs', entryFileNames: '[name].cjs', sourcemap: true, exports: 'named' },
    ],
    plugins: [IsolatedDecl()],
  },
])
