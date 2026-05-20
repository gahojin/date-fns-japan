import { TZDate } from '@date-fns/tz'
import { fc } from '@fast-check/vitest'
import { differenceInCalendarDays, isSameDay, startOfDay } from 'date-fns'
import { isAfterDay } from './index.js'

describe('isAfterDay', () => {
  it('example', () => {
    expect(isAfterDay(new Date(1989, 6, 10), new Date(1987, 1, 11))).toBe(true)
  })

  it('境界チェック', () => {
    expect(isAfterDay(new Date(2024, 10, 7), new Date(2024, 10, 6))).toBe(true)
    expect(isAfterDay(new Date(2024, 10, 7), new Date(2024, 10, 7))).toBe(false)
    expect(isAfterDay(new Date(2024, 10, 7), new Date(2024, 10, 8))).toBe(false)

    expect(isAfterDay(new Date(2024, 10, 7, 0, 0, 0), new Date(2024, 10, 6, 23, 59, 59))).toBe(true)
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 6, 23, 59, 59))).toBe(true)
    expect(isAfterDay(new Date(2024, 10, 7, 23, 59, 59), new Date(2024, 10, 6, 23, 59, 59))).toBe(true)
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 7, 0, 0, 0))).toBe(false)
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 7, 23, 59, 59))).toBe(false)
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 8, 0, 0, 0))).toBe(false)
  })

  it('異なるタイムゾーン', () => {
    const dateLeft = new TZDate(2024, 5, 7, 8, 'Asia/Singapore') // 2024-06-07T08:00:00+08:00
    const dateRight = new TZDate(2024, 5, 6, 4, 'America/New_York') // 2024-06-06T04:00:00-04:00

    expect(isSameDay(dateRight, dateLeft)).toBe(true)

    expect(isAfterDay(dateLeft, dateRight)).toBe(true)
    expect(isAfterDay(dateRight, dateLeft)).toBe(false)
  })

  it('プロパティテスト', () => {
    fc.assert(
      fc.property(fc.date({ noInvalidDate: true }), fc.date({ noInvalidDate: true }), (a, b) => {
        expect(isAfterDay(a, b)).toBe(differenceInCalendarDays(b, a) < 0)
        expect(isAfterDay(a, b)).toBe(startOfDay(a) > startOfDay(b))
      }),
    )
  })

  it('無効日', () => {
    // 常にfalseが返ること
    expect(isAfterDay(new Date(Number.NaN), new Date())).toBe(false)
    expect(isAfterDay(new Date(), new Date(Number.NaN))).toBe(false)
  })
})
