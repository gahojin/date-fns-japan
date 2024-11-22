import { isWithinGtfsCalendar } from './index'

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
})
