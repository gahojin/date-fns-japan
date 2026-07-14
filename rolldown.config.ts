import path from 'node:path'
import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import pkg from './package.json'

const inputIndexFiles = Object.keys(pkg.exports)
  .filter((entry) => !entry.endsWith('.json'))
  .map((entry) => {
    const name = path.basename(entry)
    const chunkName = name === '.' ? 'index' : `${name}/index`
    return [chunkName, path.resolve('src', name, 'index.ts')]
  })

export default defineConfig([
  {
    external: ['date-fns', /^date-fns\//],
    treeshake: {
      moduleSideEffects: false,
    },
    optimization: {
      inlineConst: true,
    },
    experimental: {
      nativeMagicString: true,
    },
    input: Object.fromEntries(inputIndexFiles),
    output: [{ dir: 'dist', format: 'es', sourcemap: true, cleanDir: true, comments: false }],
    plugins: [
      dts({
        oxc: true,
      }),
    ],
  },
])
