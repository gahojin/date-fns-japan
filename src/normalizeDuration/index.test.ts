import { normalizeDuration } from './index'

describe('normalizeDuration', () => {
  it('example', () => {
    expect(normalizeDuration({ days: 30, hours: 24 })).toEqual({ days: 31 })
  })

  it('境界チェック', () => {
    expect(normalizeDuration({ months: 12 })).toEqual({ years: 1 })
    expect(normalizeDuration({ hours: 24 })).toEqual({ days: 1 })
    expect(normalizeDuration({ minutes: 60 })).toEqual({ hours: 1 })
    expect(normalizeDuration({ seconds: 60 })).toEqual({ minutes: 1 })
    expect(normalizeDuration({ months: 12, hours: 24, minutes: 60, seconds: 60 })).toEqual({ years: 1, days: 1, hours: 1, minutes: 1 })
  })
})
