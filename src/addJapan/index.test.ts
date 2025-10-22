import { TZDate, tz } from '@date-fns/tz'
import { type Duration, parseISO } from 'date-fns'
import { add } from 'date-fns/add'
import { parse as parseDuration } from 'iso8601-duration'
import { type AddJapanOptions, addJapan } from './index'

const TZ = 'Asia/Tokyo'

const generateDate = (date: string): Date => {
  return parseISO(date, { in: tz(TZ) })
}

const addJapanDuration = (date: string, duration: string, options?: AddJapanOptions): Date => {
  return addJapan(generateDate(date), parseDuration(duration), options)
}

describe('addJapan', () => {
  it('example', () => {
    // Mon Aug 31 2020 10:19:50 + 1years,3months,2days,4weeks,5hours,6minutes,7seconds
    const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)

    expect(add(source, { days: 1 })).toEqual(new TZDate(2020, 8, 1, 10, 19, 50, TZ))
    expect(addJapan(source, { days: 1 })).toEqual(new TZDate(2020, 8, 2, 0, 0, 0, TZ))
    expect(addJapan(source, { days: 0 })).toEqual(new TZDate(2020, 8, 1, 0, 0, 0, TZ))

    const duration: Duration = {
      years: 1,
      months: 3,
      weeks: 4,
      days: 3,
    }
    const resultAdd = add(source, duration)
    const resultAddJapan = addJapan(source, duration)
    // Sat Jan 01 2022 00:00:00
    expect(resultAddJapan).toEqual(new TZDate(2022, 0, 1, 0, 0, 0, TZ))
    // Fri Dec 31 2021 10:19:50
    expect(resultAdd).toEqual(new TZDate(2021, 11, 31, 10, 19, 50, TZ))
  })

  it('民法に沿っているか', () => {
    // 当日
    expect(addJapanDuration('2020-06-01', 'P1D')).toEqual(generateDate('2020-06-02T00:00:00'))
    // 2日間
    expect(addJapanDuration('2020-06-01', 'P2D')).toEqual(generateDate('2020-06-03T00:00:00'))
    // 月末/2日間
    expect(addJapanDuration('2020-06-30', 'P2D')).toEqual(generateDate('2020-07-02T00:00:00'))
    // 1ヶ月
    expect(addJapanDuration('2020-06-01', 'P1M')).toEqual(generateDate('2020-07-01T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1M')).toEqual(generateDate('2020-10-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P1M')).toEqual(generateDate('2020-11-10T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P1M')).toEqual(generateDate('2021-01-01T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P1M')).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2022-02-28', 'P1M')).toEqual(generateDate('2022-03-28T00:00:00'))
    expect(addJapanDuration('2024-01-29', 'P1M')).toEqual(generateDate('2024-02-29T00:00:00'))
    expect(addJapanDuration('2024-01-30', 'P1M')).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-01-31', 'P1M')).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-02-01', 'P1M')).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-03-01', 'P1M')).toEqual(generateDate('2024-04-01T00:00:00'))
    // 1ヶ月 1日
    expect(addJapanDuration('2020-06-01', 'P1M1D')).toEqual(generateDate('2020-07-02T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1M1D')).toEqual(generateDate('2020-10-02T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P1M1D')).toEqual(generateDate('2020-11-11T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P1M1D')).toEqual(generateDate('2021-01-02T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P1M1D')).toEqual(generateDate('2021-03-02T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P1M1D')).toEqual(generateDate('2021-03-29T00:00:00'))
    expect(addJapanDuration('2024-01-29', 'P1M1D')).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-01-30', 'P1M1D')).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-01-31', 'P1M1D')).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-02-01', 'P1M1D')).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-03-01', 'P1M1D')).toEqual(generateDate('2024-04-02T00:00:00'))
    // 3ヶ月
    expect(addJapanDuration('2020-06-01', 'P3M')).toEqual(generateDate('2020-09-01T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P3M')).toEqual(generateDate('2020-12-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P3M')).toEqual(generateDate('2021-01-10T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P3M')).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P3M')).toEqual(generateDate('2021-05-01T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P3M')).toEqual(generateDate('2021-05-28T00:00:00'))
    // 6ヶ月
    expect(addJapanDuration('2020-06-01', 'P6M')).toEqual(generateDate('2020-12-01T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P6M')).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P6M')).toEqual(generateDate('2021-04-10T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P6M')).toEqual(generateDate('2021-06-01T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P6M')).toEqual(generateDate('2021-07-31T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P6M')).toEqual(generateDate('2021-08-28T00:00:00'))
    // 1週間
    expect(addJapanDuration('2021-02-28', 'P1W')).toEqual(generateDate('2021-03-07T00:00:00'))
    // その他
    expect(addJapanDuration('2023-01-01', 'P2M')).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項 (平年)
    expect(addJapanDuration('2024-01-01', 'P2M')).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項 (閏年)
    expect(addJapanDuration('2024-01-20', 'P2M')).toEqual(generateDate('2024-03-20T00:00:00')) // 143条2項
    expect(addJapanDuration('2024-01-31', 'P2M')).toEqual(generateDate('2024-03-31T00:00:00')) // 143条2項
    expect(addJapanDuration('2023-01-31', 'P1M')).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項ただし書 (平年)
    expect(addJapanDuration('2024-01-31', 'P1M')).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項ただし書 (閏年)
    expect(addJapanDuration('2024-03-31', 'P1M')).toEqual(generateDate('2024-05-01T00:00:00')) // 143条2項ただし書
    expect(addJapanDuration('2024-03-31', 'P1M')).toEqual(generateDate('2024-05-01T00:00:00')) // 143条2項ただし書
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1D')).toEqual(generateDate('2024-06-01T00:00:00'))
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1M')).toEqual(generateDate('2024-07-01T00:00:00'))
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1MT1H')).toEqual(generateDate('2024-06-30T02:00:00'))
    expect(addJapanDuration('2023-01-29', 'P1M')).toEqual(generateDate('2023-03-01T00:00:00'))
    expect(addJapanDuration('2020-02-28', 'P1Y')).toEqual(generateDate('2021-02-28T00:00:00'))
    expect(addJapanDuration('2020-02-28T01:00:00', 'P1Y')).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2020-08-15', 'P1Y3M')).toEqual(generateDate('2021-11-15T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1Y1M')).toEqual(generateDate('2021-10-01T00:00:00'))
    expect(addJapanDuration('2024-06-01T18:00:00', 'PT30H')).toEqual(generateDate('2024-06-03T00:00:00'))
    expect(addJapanDuration('2024-06-01', 'P2Y')).toEqual(generateDate('2026-06-01T00:00:00'))
  })

  it('民法139条/140条を無視し、常に初日参入する', () => {
    // 当日
    expect(addJapanDuration('2020-06-01', 'P1D', { excludeStartDate: false })).toEqual(generateDate('2020-06-02T00:00:00'))
    // 2日間
    expect(addJapanDuration('2020-06-01', 'P2D', { excludeStartDate: false })).toEqual(generateDate('2020-06-03T00:00:00'))
    // 月末/2日間
    expect(addJapanDuration('2020-06-30', 'P2D', { excludeStartDate: false })).toEqual(generateDate('2020-07-02T00:00:00'))
    // 1ヶ月
    expect(addJapanDuration('2020-06-01', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2020-07-01T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2020-10-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2020-11-10T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2021-01-01T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2022-02-28', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2022-03-28T00:00:00'))
    expect(addJapanDuration('2024-01-29', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-02-29T00:00:00'))
    expect(addJapanDuration('2024-01-30', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-01-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-02-01', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-03-01', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-04-01T00:00:00'))
    // 1ヶ月 1日
    expect(addJapanDuration('2020-06-01', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2020-07-02T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2020-10-02T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2020-11-11T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2021-01-02T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2021-03-02T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2021-03-29T00:00:00'))
    expect(addJapanDuration('2024-01-29', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-01-30', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-01-31', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-02-01', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-03-01', 'P1M1D', { excludeStartDate: false })).toEqual(generateDate('2024-04-02T00:00:00'))
    // 3ヶ月
    expect(addJapanDuration('2020-06-01', 'P3M', { excludeStartDate: false })).toEqual(generateDate('2020-09-01T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P3M', { excludeStartDate: false })).toEqual(generateDate('2020-12-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P3M', { excludeStartDate: false })).toEqual(generateDate('2021-01-10T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P3M', { excludeStartDate: false })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P3M', { excludeStartDate: false })).toEqual(generateDate('2021-05-01T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P3M', { excludeStartDate: false })).toEqual(generateDate('2021-05-28T00:00:00'))
    // 6ヶ月
    expect(addJapanDuration('2020-06-01', 'P6M', { excludeStartDate: false })).toEqual(generateDate('2020-12-01T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P6M', { excludeStartDate: false })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P6M', { excludeStartDate: false })).toEqual(generateDate('2021-04-10T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P6M', { excludeStartDate: false })).toEqual(generateDate('2021-06-01T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P6M', { excludeStartDate: false })).toEqual(generateDate('2021-07-31T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P6M', { excludeStartDate: false })).toEqual(generateDate('2021-08-28T00:00:00'))
    // 1週間
    expect(addJapanDuration('2021-02-28', 'P1W', { excludeStartDate: false })).toEqual(generateDate('2021-03-07T00:00:00'))
    // その他
    expect(addJapanDuration('2023-01-01', 'P2M', { excludeStartDate: false })).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項 (平年)
    expect(addJapanDuration('2024-01-01', 'P2M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項 (閏年)
    expect(addJapanDuration('2024-01-20', 'P2M', { excludeStartDate: false })).toEqual(generateDate('2024-03-20T00:00:00')) // 143条2項
    expect(addJapanDuration('2024-01-31', 'P2M', { excludeStartDate: false })).toEqual(generateDate('2024-03-31T00:00:00')) // 143条2項
    expect(addJapanDuration('2023-01-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項ただし書 (平年)
    expect(addJapanDuration('2024-01-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項ただし書 (閏年)
    expect(addJapanDuration('2024-03-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-05-01T00:00:00')) // 143条2項ただし書
    expect(addJapanDuration('2024-03-31', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-05-01T00:00:00')) // 143条2項ただし書
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1D', { excludeStartDate: false })).toEqual(generateDate('2024-05-31T00:00:00'))
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-06-30T00:00:00'))
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1MT1H', { excludeStartDate: false })).toEqual(generateDate('2024-06-30T02:00:00'))
    expect(addJapanDuration('2023-01-29', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2023-03-01T00:00:00'))
    expect(addJapanDuration('2020-02-28', 'P1Y', { excludeStartDate: false })).toEqual(generateDate('2021-02-28T00:00:00'))
    expect(addJapanDuration('2020-02-28T01:00:00', 'P1Y', { excludeStartDate: false })).toEqual(generateDate('2021-02-28T00:00:00'))
    expect(addJapanDuration('2020-08-15', 'P1Y3M', { excludeStartDate: false })).toEqual(generateDate('2021-11-15T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1Y1M', { excludeStartDate: false })).toEqual(generateDate('2021-10-01T00:00:00'))
    expect(addJapanDuration('2024-06-01T18:00:00', 'PT30H', { excludeStartDate: false })).toEqual(generateDate('2024-06-03T00:00:00'))
    expect(addJapanDuration('2024-06-01', 'P2Y', { excludeStartDate: false })).toEqual(generateDate('2026-06-01T00:00:00'))
  })

  it('民法139条/140条を無視し、常に初日参入しない', () => {
    // 当日 (6/2 24:00になる)
    expect(addJapanDuration('2020-06-01', 'P1D', { excludeStartDate: true })).toEqual(generateDate('2020-06-03T00:00:00'))
    // 2日間
    expect(addJapanDuration('2020-06-01', 'P2D', { excludeStartDate: true })).toEqual(generateDate('2020-06-04T00:00:00'))
    // 月末/2日間
    expect(addJapanDuration('2020-06-30', 'P2D', { excludeStartDate: true })).toEqual(generateDate('2020-07-03T00:00:00'))
    // 1ヶ月
    expect(addJapanDuration('2020-06-01', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2020-07-02T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2020-10-01T00:00:00')) // 9/31がないため、9/30 24:00
    expect(addJapanDuration('2020-10-10', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2020-11-11T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2021-01-02T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2022-02-28', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2022-04-01T00:00:00')) // 3/1から1M扱い
    expect(addJapanDuration('2024-01-29', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-01-30', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-01-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(addJapanDuration('2024-02-01', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-03-01', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-04-02T00:00:00'))
    // 1ヶ月 1日
    expect(addJapanDuration('2020-06-01', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2020-07-03T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2020-10-02T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2020-11-12T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2021-01-03T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2021-03-02T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2021-04-02T00:00:00')) // 3/1から1M1D扱い
    expect(addJapanDuration('2024-01-29', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-01-30', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-01-31', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2024-03-02T00:00:00'))
    expect(addJapanDuration('2024-02-01', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2024-03-03T00:00:00'))
    expect(addJapanDuration('2024-03-01', 'P1M1D', { excludeStartDate: true })).toEqual(generateDate('2024-04-03T00:00:00'))
    // 3ヶ月
    expect(addJapanDuration('2020-06-01', 'P3M', { excludeStartDate: true })).toEqual(generateDate('2020-09-02T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P3M', { excludeStartDate: true })).toEqual(generateDate('2020-12-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P3M', { excludeStartDate: true })).toEqual(generateDate('2021-01-11T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P3M', { excludeStartDate: true })).toEqual(generateDate('2021-03-02T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P3M', { excludeStartDate: true })).toEqual(generateDate('2021-05-01T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P3M', { excludeStartDate: true })).toEqual(generateDate('2021-06-01T00:00:00')) // 3/1から3M扱い
    // 6ヶ月
    expect(addJapanDuration('2020-06-01', 'P6M', { excludeStartDate: true })).toEqual(generateDate('2020-12-02T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P6M', { excludeStartDate: true })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2020-10-10', 'P6M', { excludeStartDate: true })).toEqual(generateDate('2021-04-11T00:00:00'))
    expect(addJapanDuration('2020-12-01', 'P6M', { excludeStartDate: true })).toEqual(generateDate('2021-06-02T00:00:00'))
    expect(addJapanDuration('2021-01-31', 'P6M', { excludeStartDate: true })).toEqual(generateDate('2021-08-01T00:00:00'))
    expect(addJapanDuration('2021-02-28', 'P6M', { excludeStartDate: true })).toEqual(generateDate('2021-09-01T00:00:00'))
    // 1週間
    expect(addJapanDuration('2021-02-28', 'P1W', { excludeStartDate: true })).toEqual(generateDate('2021-03-08T00:00:00'))
    // その他
    expect(addJapanDuration('2023-01-01', 'P2M', { excludeStartDate: true })).toEqual(generateDate('2023-03-02T00:00:00')) // 143条2項 (平年)
    expect(addJapanDuration('2024-01-01', 'P2M', { excludeStartDate: true })).toEqual(generateDate('2024-03-02T00:00:00')) // 143条2項 (閏年)
    expect(addJapanDuration('2024-01-20', 'P2M', { excludeStartDate: true })).toEqual(generateDate('2024-03-21T00:00:00')) // 143条2項
    expect(addJapanDuration('2024-01-31', 'P2M', { excludeStartDate: true })).toEqual(generateDate('2024-04-01T00:00:00')) // 143条2項
    expect(addJapanDuration('2023-01-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項ただし書 (平年)
    expect(addJapanDuration('2024-01-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項ただし書 (閏年)
    expect(addJapanDuration('2024-03-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-05-01T00:00:00')) // 143条2項ただし書
    expect(addJapanDuration('2024-03-31', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-05-01T00:00:00')) // 143条2項ただし書
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1D', { excludeStartDate: true })).toEqual(generateDate('2024-06-01T00:00:00'))
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-07-01T00:00:00'))
    expect(addJapanDuration('2024-05-30T01:00:00', 'P1MT1H', { excludeStartDate: true })).toEqual(generateDate('2024-06-30T02:00:00')) // 6/1から1M1H
    expect(addJapanDuration('2023-01-29', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2023-03-01T00:00:00'))
    expect(addJapanDuration('2020-02-28', 'P1Y', { excludeStartDate: true })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2020-02-28T01:00:00', 'P1Y', { excludeStartDate: true })).toEqual(generateDate('2021-03-01T00:00:00'))
    expect(addJapanDuration('2020-08-15', 'P1Y3M', { excludeStartDate: true })).toEqual(generateDate('2021-11-16T00:00:00'))
    expect(addJapanDuration('2020-08-31', 'P1Y1M', { excludeStartDate: true })).toEqual(generateDate('2021-10-01T00:00:00'))
    expect(addJapanDuration('2024-06-01T18:00:00', 'PT30H', { excludeStartDate: true })).toEqual(generateDate('2024-06-03T00:00:00'))
    expect(addJapanDuration('2024-06-01', 'P2Y', { excludeStartDate: true })).toEqual(generateDate('2026-06-02T00:00:00'))
  })

  it('無効日', () => {
    expect(addJapan(new Date(Number.NaN), parseDuration('P1M'))).toEqual(new Date(Number.NaN))
  })

  it('timezone', () => {
    const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)
    expect(addJapan(source, parseDuration('P1M'), { in: tz('Europe/Prague') }).toISOString()).toEqual('2020-10-01T00:00:00.000+02:00')
  })
})
