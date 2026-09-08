import { test } from 'vitest'
import { isBeforeDay } from './index.js'

test('benchmark: isBeforeDay', async ({ bench }) => {
  await bench('isBeforeDay', () => {
    isBeforeDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
  }).run()
})
