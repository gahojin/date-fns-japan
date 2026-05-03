import path from 'node:path'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const inputIndexFiles = Object.keys(pkg.exports)
  .filter((entry) => !entry.endsWith('.json'))
  .map((entry) => {
    const name = path.basename(entry)
    return [path.relative('.', `${name}/index`), path.resolve('src', `${name}/index.ts`)]
  })

export default defineConfig({
  plugins: [
    dts({
      exclude: ['src/**/*.test.ts', 'src/**/*.bench.ts'],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    lib: {
      entry: Object.fromEntries(inputIndexFiles),
      formats: ['es'],
    },
    minify: false,
    sourcemap: true,
    rolldownOptions: {
      treeshake: true,
      output: {
        cleanDir: true,
        comments: false,
        preserveModules: true,
      },
      platform: 'neutral',
      external: ['date-fns', /^date-fns\//],
      optimization: {
        inlineConst: { mode: 'all', pass: 5 },
      },
      experimental: {
        nativeMagicString: true,
      },
    },
  },
})
