import type { GtfsCalendar } from '@/types'
import { fc } from '@fast-check/vitest'
import { getDay, isValid, startOfDay } from 'date-fns'
import { isWithinGtfsCalendar } from './index'

const setWeek = (condition: GtfsCalendar, week: number, value?: boolean) => {
  switch (week) {
    case 0:
      condition.sun = value
      break
    case 1:
      condition.mon = value
      break
    case 2:
      condition.tue = value
      break
    case 3:
      condition.wed = value
      break
    case 4:
      condition.thu = value
      break
    case 5:
      condition.fri = value
      break
    case 6:
      condition.sat = value
      break
    default:
      throw new Error('invalid value')
  }
}

describe('isWithinGtfsCalendar', () => {
  it('example', () => {
    expect(isWithinGtfsCalendar(new Date(2024, 10, 22), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })).toBeTrue()
  })

  it('境界チェック', () => {
    expect(isWithinGtfsCalendar(new Date(2024, 10, 1), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30) })).toBeFalse()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 1), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 30), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30) })).toBeFalse()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 30), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), sat: true })).toBeTrue()

    expect(
      isWithinGtfsCalendar(new Date(2024, 10, 2), {
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2024, 10, 30),
        includes: [new Date(2024, 10, 2)],
      }),
    ).toBeTrue()
    expect(
      isWithinGtfsCalendar(new Date(2024, 10, 1), {
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2024, 10, 30),
        fri: true,
        excludes: [new Date(2024, 10, 1)],
      }),
    ).toBeFalse()

    expect(isWithinGtfsCalendar(new Date(2024, 10, 3), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), sun: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 4), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), mon: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 5), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), tue: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 6), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), wed: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 7), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), thu: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 8), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })).toBeTrue()
    expect(isWithinGtfsCalendar(new Date(2024, 10, 9), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), sat: true })).toBeTrue()
  })

  it('プロパティテスト', () => {
    fc.assert(
      fc.property(fc.date({ noInvalidDate: true }), fc.date({ noInvalidDate: true }), fc.date({ noInvalidDate: true }), (targetDate, startDate, endDate) => {
        // 期間チェックが行われること (無効日の場合、期間内として扱われる)
        const allWeeksCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
        expect(isWithinGtfsCalendar(targetDate, allWeeksCondition)).not.toBe(
          +startOfDay(startDate) > +startOfDay(targetDate) || +startOfDay(targetDate) > +startOfDay(endDate),
        )

        // 曜日チェックが行われること
        const weekCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
        setWeek(weekCondition, getDay(targetDate), false)
        expect(isWithinGtfsCalendar(targetDate, weekCondition)).toBeFalse()

        // 対象日チェックが行われること (無効日の場合、対象日とならない)
        const includeCondition = { startDate, endDate, includes: [targetDate] }
        expect(isWithinGtfsCalendar(targetDate, includeCondition)).toBe(
          isValid(startOfDay(targetDate)) && isWithinGtfsCalendar(targetDate, allWeeksCondition),
        )

        // 対象外日チェックが行われること (無効日の場合、対象外日とならない)
        const excludeCondition = {
          startDate,
          endDate,
          excludes: [targetDate],
          mon: true,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: true,
          sun: true,
        }
        expect(isWithinGtfsCalendar(targetDate, excludeCondition)).toBe(!isValid(startOfDay(targetDate)))
      }),
    )
  })

  it('無効日', () => {
    const targetDate = new Date(Number.NaN)
    const startDate = new Date("1970-01-01T00:00:00.000Z")
    const endDate = new Date("2099-12-31T23:59:59.999Z")

    const allWeeksCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    expect(isWithinGtfsCalendar(targetDate, allWeeksCondition)).toBeFalse()

    // 曜日チェックが行われること
    const weekCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    expect(isWithinGtfsCalendar(targetDate, weekCondition)).toBeFalse()

    // 対象日チェックが行われること (無効日の場合、対象日とならない)
    const includeCondition = { startDate, endDate, includes: [targetDate] }
    expect(isWithinGtfsCalendar(targetDate, includeCondition)).toBeFalse()

    // 対象外日チェックが行われること (無効日の場合、対象外日とならない)
    const excludeCondition = {
      startDate,
      endDate,
      excludes: [targetDate],
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    }
    expect(isWithinGtfsCalendar(targetDate, excludeCondition)).toBeFalse()
  })
})
