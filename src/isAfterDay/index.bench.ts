import { bench, describe } from 'vitest'
import { isAfterDay } from './index'

describe('benchmark: isAfterDay', () => {
  bench('example', () => {
    isAfterDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
  })
})
