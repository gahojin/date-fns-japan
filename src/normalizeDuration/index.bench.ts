import { bench, describe } from 'vitest'
import { normalizeDuration } from '../normalizeDuration'

describe('benchmark: normalizeDuration', () => {
  bench('example', () => {
    normalizeDuration({ minutes: 60 })
  })
})
