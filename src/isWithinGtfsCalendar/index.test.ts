import { TZDate, tz } from '@date-fns/tz'
import { fc } from '@fast-check/vitest'
import { getDay, isValid, startOfDay } from 'date-fns'
import type { GtfsCalendar } from '~/types.js'
import { isWithinGtfsCalendar } from './index.js'

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
    expect(isWithinGtfsCalendar(new Date(2024, 10, 22), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })).toBe(true)
  })

  it('境界チェック', () => {
    expect(isWithinGtfsCalendar(new Date(2024, 10, 1), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30) })).toBe(false)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 1), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 30), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30) })).toBe(false)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 30), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), sat: true })).toBe(true)

    expect(
      isWithinGtfsCalendar(new Date(2024, 10, 2), {
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2024, 10, 30),
        includes: [new Date(2024, 10, 2)],
      }),
    ).toBe(true)
    expect(
      isWithinGtfsCalendar(new Date(2024, 10, 1), {
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2024, 10, 30),
        fri: true,
        excludes: [new Date(2024, 10, 1)],
      }),
    ).toBe(false)

    expect(isWithinGtfsCalendar(new Date(2024, 10, 3), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), sun: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 4), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), mon: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 5), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), tue: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 6), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), wed: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 7), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), thu: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 8), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })).toBe(true)
    expect(isWithinGtfsCalendar(new Date(2024, 10, 9), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), sat: true })).toBe(true)
  })

  it('プロパティテスト', () => {
    fc.assert(
      fc.property(
        fc.date({ noInvalidDate: true }),
        fc.date({ noInvalidDate: true }),
        fc.date({ noInvalidDate: true }),
        (targetDate, startDate, endDate) => {
          // 期間チェックが行われること (無効日の場合、期間内として扱われる)
          const allWeeksCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
          expect(isWithinGtfsCalendar(targetDate, allWeeksCondition)).not.toBe(
            +startOfDay(startDate) > +startOfDay(targetDate) || +startOfDay(targetDate) > +startOfDay(endDate),
          )

          // 曜日チェックが行われること
          const weekCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
          setWeek(weekCondition, getDay(targetDate), false)
          expect(isWithinGtfsCalendar(targetDate, weekCondition)).toBe(false)

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
        },
      ),
    )
  })

  it('無効日', () => {
    const targetDate = new Date(Number.NaN)
    const startDate = new Date('1970-01-01T00:00:00.000Z')
    const endDate = new Date('2099-12-31T23:59:59.999Z')

    const allWeeksCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    expect(isWithinGtfsCalendar(targetDate, allWeeksCondition)).toBe(false)

    // 曜日チェックが行われること
    const weekCondition = { startDate, endDate, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
    expect(isWithinGtfsCalendar(targetDate, weekCondition)).toBe(false)

    // 対象日チェックが行われること (無効日の場合、対象日とならない)
    const includeCondition = { startDate, endDate, includes: [targetDate] }
    expect(isWithinGtfsCalendar(targetDate, includeCondition)).toBe(false)

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
    expect(isWithinGtfsCalendar(targetDate, excludeCondition)).toBe(false)
  })

  it('timezone (options.in)', () => {
    const TZ = 'Asia/Tokyo'
    const date = new TZDate(2024, 10, 22, 0, 0, 0, TZ)
    const calendar: GtfsCalendar = {
      startDate: new TZDate(2024, 10, 1, 0, 0, 0, TZ),
      endDate: new TZDate(2024, 10, 30, 0, 0, 0, TZ),
      fri: true,
    }

    // 全て同じタイムゾーンなら一致する
    expect(isWithinGtfsCalendar(date, calendar, { in: tz(TZ) })).toBe(true)

    // options.in で別のタイムゾーン（Prague: UTC+1/2）を指定
    // 2024-11-22 00:00:00 Tokyo は 2024-11-21 16:00:00 Prague
    // Pragueにおいて、11-21は木曜日なので、fri: true の条件に合致しなくなる
    expect(isWithinGtfsCalendar(date, calendar, { in: tz('Europe/Prague') })).toBe(false)
  })
})
