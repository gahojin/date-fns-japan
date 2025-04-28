import path from 'node:path'
import { defineConfig } from 'rolldown'
import IsolatedDecl from 'unplugin-isolated-decl/rolldown'
import pkg from './package.json'

const inputIndexFiles = Object.keys(pkg.exports).map((entry) => {
  const name = path.basename(entry)
  return [`${name}/index`, path.resolve('src', `${name}/index.ts`)]
})

export default defineConfig([
  {
    external: [/^date-fns/],
    treeshake: true,
    input: Object.fromEntries(inputIndexFiles),
    resolve: {
      alias: {
        '@': path.resolve('src/'),
      },
    },
    output: [
      { format: 'esm', entryFileNames: '[name].mjs', sourcemap: true },
      { format: 'cjs', entryFileNames: '[name].cjs', sourcemap: true, exports: 'named' },
    ],
    plugins: [IsolatedDecl()],
  },
])
