import { isAfterDay } from './index'

describe('isAfterDay', () => {
  it('example', () => {
    expect(isAfterDay(new Date(1989, 6, 10), new Date(1987, 1, 11))).toBeTrue()
  })

  it('境界チェック', () => {
    expect(isAfterDay(new Date(2024, 10, 7), new Date(2024, 10, 6))).toBeTrue()
    expect(isAfterDay(new Date(2024, 10, 7), new Date(2024, 10, 7))).toBeFalse()
    expect(isAfterDay(new Date(2024, 10, 7), new Date(2024, 10, 8))).toBeFalse()

    expect(isAfterDay(new Date(2024, 10, 7, 0, 0, 0), new Date(2024, 10, 6, 23, 59, 59))).toBeTrue()
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 6, 23, 59, 59))).toBeTrue()
    expect(isAfterDay(new Date(2024, 10, 7, 23, 59, 59), new Date(2024, 10, 6, 23, 59, 59))).toBeTrue()
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 7, 0, 0, 0))).toBeFalse()
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 7, 23, 59, 59))).toBeFalse()
    expect(isAfterDay(new Date(2024, 10, 7, 10, 0, 0), new Date(2024, 10, 8, 0, 0, 0))).toBeFalse()
  })
})
