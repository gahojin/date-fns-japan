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
})
