import { normalizeDuration } from '@/normalizeDuration'
import { bench, describe } from 'vitest'

describe('benchmark: normalizeDuration', () => {
  bench('example', () => {
    normalizeDuration({ minutes: 60 })
  })
})
