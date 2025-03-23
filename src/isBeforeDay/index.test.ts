import { TZDate } from '@date-fns/tz'
import { fc } from '@fast-check/vitest'
import { differenceInCalendarDays, isSameDay, startOfDay } from 'date-fns'
import { isBeforeDay } from './index'

describe('isBeforeDay', () => {
  it('example', () => {
    expect(isBeforeDay(new Date(1989, 6, 10), new Date(1987, 1, 11))).toBeFalse()
  })

  it('境界チェック', () => {
    expect(isBeforeDay(new Date(2024, 10, 7), new Date(2024, 10, 6))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7), new Date(2024, 10, 7))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7), new Date(2024, 10, 8))).toBeTrue()

    expect(isBeforeDay(new Date(2024, 10, 7, 0, 0, 0), new Date(2024, 10, 6, 23, 59, 59))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 6, 23, 59, 59))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7, 23, 59, 59), new Date(2024, 10, 6, 23, 59, 59))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 7, 0, 0, 0))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 7, 23, 59, 59))).toBeFalse()
    expect(isBeforeDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 8, 0, 0, 0))).toBeTrue()
  })

  it('異なるタイムゾーン', () => {
    const dateLeft = new TZDate(2024, 5, 7, 22, 'Asia/Singapore') // 2024-06-07T22:00:00+08:00
    const dateRight = new TZDate(2024, 5, 6, 23, 'America/New_York') // 2024-06-06T23:00:00-04:00

    expect(isSameDay(dateLeft, dateRight)).toBe(true)

    expect(isBeforeDay(dateLeft, dateRight)).toBe(false)
    expect(isBeforeDay(dateRight, dateLeft)).toBe(true)
  })

  it('プロパティテスト', () => {
    fc.assert(
      fc.property(fc.date({ noInvalidDate: true }), fc.date({ noInvalidDate: true }), (a, b) => {
        expect(isBeforeDay(a, b)).toBe(differenceInCalendarDays(b, a) > 0)
        expect(isBeforeDay(a, b)).toBe(startOfDay(a) < startOfDay(b))
      }),
    )
  })

  it('無効日', () => {
    // 常にfalseが返ること
    expect(isBeforeDay(new Date(Number.NaN), new Date())).toBeFalse()
    expect(isBeforeDay(new Date(), new Date(Number.NaN))).toBeFalse()
  })
})
