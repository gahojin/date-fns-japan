import { bench, describe } from 'vitest'
import { normalizeDuration } from '~/normalizeDuration/index.js'

describe('benchmark: normalizeDuration', () => {
  bench('example', () => {
    normalizeDuration({ minutes: 60 })
  })
})
