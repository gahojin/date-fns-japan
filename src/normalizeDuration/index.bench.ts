import { test } from 'vitest'
import { normalizeDuration } from '~/normalizeDuration/index.js'

test('benchmark: normalizeDuration', async ({ bench }) => {
  await bench('normalizeDuration', () => {
    normalizeDuration({ minutes: 60 })
  }).run()
})
