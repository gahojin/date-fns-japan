import { fc } from '@fast-check/vitest'
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

  it('プロパティテスト', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer(),
        fc.integer(),
        fc.integer(),
        fc.integer(),
        fc.integer(),
        (years, months, days, hours, minutes, seconds) => {
          const result = normalizeDuration({ years, months, days, hours, minutes, seconds })

          // 年
          if (years) {
            if (typeof result.years === 'number') {
              // 年数に、月数を年数に換算した分が加算されていること
              if (months < 0) {
                expect(result.years).toBeLessThanOrEqual(years)
              } else {
                expect(result.years).toBeGreaterThanOrEqual(years)
              }
            }
          } else if (months >= 12) {
            expect(result.years).toBeGreaterThanOrEqual(1)
          }

          // 月
          if (months) {
            // 月数が12未満になっていること
            if (months % 12 === 0) {
              expect(result.months).toBeUndefined()
            } else {
              expect(result.months).toBeLessThan(12)
            }
          }

          // 時
          if (typeof result.hours !== 'undefined') {
            expect(result.hours).toBeLessThan(24)
          }

          // 分
          if (typeof result.minutes !== 'undefined') {
            expect(result.minutes).toBeLessThan(60)
          }

          // 秒
          if (typeof result.seconds !== 'undefined') {
            expect(result.seconds).toBeLessThan(60)
          }
        },
      ),
    )
  })
})
