import { bench, describe } from 'vitest'
import { isBeforeDay } from './index'

describe('benchmark: isBeforeDay', () => {
  bench('example', () => {
    isBeforeDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
  })
})
