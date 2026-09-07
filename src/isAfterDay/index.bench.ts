import { test } from 'vitest'
import { isAfterDay } from './index.js'

test('benchmark: isAfterDay', async ({ bench }) => {
  await bench('isAfterDay', () => {
    isAfterDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
  }).run()
})
