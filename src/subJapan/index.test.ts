import { TZDate, tz } from '@date-fns/tz'
import { type Duration, parseISO, sub } from 'date-fns'
import { parse as parseDuration } from 'iso8601-duration'
import { type SubJapanOptions, subJapan } from './index'

const TZ = 'Asia/Tokyo'

const generateDate = (date: string): Date => {
  return parseISO(date, { in: tz(TZ) })
}

const subJapanDuration = (date: string, duration: string, options?: SubJapanOptions): Date => {
  return subJapan(generateDate(date), parseDuration(duration), options)
}

describe('subJapan', () => {
  it('example', () => {
    // Mon Aug 31 2020 10:19:50 - 1years,3months,2days,4weeks,5hours,6minutes,7seconds
    const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)

    expect(sub(source, { days: 1 })).toEqual(new TZDate(2020, 7, 30, 10, 19, 50, TZ))
    expect(subJapan(source, { days: 1 })).toEqual(new TZDate(2020, 7, 30, 0, 0, 0, TZ))
    expect(subJapan(source, { days: 0 })).toEqual(new TZDate(2020, 7, 31, 0, 0, 0, TZ))

    const duration: Duration = {
      years: 1,
      months: 3,
      weeks: 4,
      days: 3,
    }
    const resultSub = sub(source, duration)
    const resultSubJapan = subJapan(source, duration)
    // Mon Apr 30 2019 00:00:00
    expect(resultSubJapan).toEqual(new TZDate(2019, 3, 30, 0, 0, 0, TZ))
    // Tue Apr 30 2019 10:19:50
    expect(resultSub).toEqual(new TZDate(2019, 3, 30, 10, 19, 50, TZ))
  })

  it('指定日時から期間が引けているか (excludeStartDate=未指定)', () => {
    // 時刻が0:00の場合、初日参入のため、その日の24:00になること
    expect(subJapanDuration('2020-06-01', 'P0D')).toEqual(generateDate('2020-06-02T00:00:00'))
    // 当日
    expect(subJapanDuration('2020-06-01', 'P1D')).toEqual(generateDate('2020-06-01T00:00:00'))
    // 1週間
    expect(subJapanDuration('2021-03-07', 'P1W')).toEqual(generateDate('2021-03-01T00:00:00'))
    // その他
    expect(subJapanDuration('2023-03-29', 'P1M')).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項 (平年)
    expect(subJapanDuration('2024-03-29', 'P1M')).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項 (閏年)
    expect(subJapanDuration('2023-03-29T01:00:00', 'P1M')).toEqual(generateDate('2023-03-01T00:00:00'))
    expect(subJapanDuration('2024-03-29T01:00:00', 'P1M')).toEqual(generateDate('2024-02-29T00:00:00'))
    expect(subJapanDuration('2023-03-29T03:00:00', 'P1MT1H')).toEqual(generateDate('2023-03-01T02:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'P1MT1H')).toEqual(generateDate('2024-02-29T02:00:00'))
    expect(subJapanDuration('2025-10-20T17:00:00', 'P1D')).toEqual(generateDate('2025-10-19T00:00:00'))
    expect(subJapanDuration('2025-10-20T17:00:00', 'PT24H')).toEqual(generateDate('2025-10-19T17:00:00'))
    expect(subJapanDuration('2025-10-20T17:00:00', 'PT0S')).toEqual(generateDate('2025-10-20T00:00:00'))
    expect(subJapanDuration('2025-03-29', '-P1M')).toEqual(generateDate('2025-03-01T00:00:00'))
    expect(subJapanDuration('2025-03-30', '-P1M')).toEqual(generateDate('2025-03-01T00:00:00'))
    expect(subJapanDuration('2025-03-31', '-P1MT1H')).toEqual(generateDate('2025-02-28T23:00:00'))

    // preserveTimeOnZero=trueかつ、PT0Sの場合は、excludeStartDateの設定に関わらず、時刻維持されること
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S')).toEqual(generateDate('2024-03-29T00:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { preserveTimeOnZero: true })).toEqual(generateDate('2024-03-29T03:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { preserveTimeOnZero: false })).toEqual(generateDate('2024-03-29T00:00:00'))
  })

  it('指定日時から期間が引けているか (excludeStartDate=false)', () => {
    // 初日参入のため、その日の24:00になること
    expect(subJapanDuration('2020-06-01', 'P0D', { excludeStartDate: false })).toEqual(generateDate('2020-06-02T00:00:00'))
    // 当日
    expect(subJapanDuration('2020-06-01', 'P1D', { excludeStartDate: false })).toEqual(generateDate('2020-06-01T00:00:00'))
    // 1週間
    expect(subJapanDuration('2021-03-07', 'P1W', { excludeStartDate: false })).toEqual(generateDate('2021-03-01T00:00:00'))
    // その他
    expect(subJapanDuration('2023-03-29', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項 (平年)
    expect(subJapanDuration('2024-03-29', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00')) // 143条2項 (閏年)
    expect(subJapanDuration('2023-03-29T01:00:00', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2023-03-01T00:00:00'))
    expect(subJapanDuration('2024-03-29T01:00:00', 'P1M', { excludeStartDate: false })).toEqual(generateDate('2024-03-01T00:00:00'))
    expect(subJapanDuration('2023-03-29T03:00:00', 'P1MT1H', { excludeStartDate: false })).toEqual(generateDate('2023-03-01T02:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'P1MT1H', { excludeStartDate: false })).toEqual(generateDate('2024-02-29T02:00:00'))

    // preserveTimeOnZero=trueかつ、PT0Sの場合は、excludeStartDateの設定に関わらず、時刻維持されること
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { excludeStartDate: false })).toEqual(generateDate('2024-03-30T00:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { excludeStartDate: false, preserveTimeOnZero: true })).toEqual(
      generateDate('2024-03-29T03:00:00'),
    )
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { excludeStartDate: false, preserveTimeOnZero: false })).toEqual(
      generateDate('2024-03-30T00:00:00'),
    )
  })

  it('指定日時から期間が引けているか (excludeStartDate=true)', () => {
    // 初日不参入のため、その日の00:00になること
    expect(subJapanDuration('2020-06-01', 'P0D', { excludeStartDate: true })).toEqual(generateDate('2020-06-01T00:00:00'))
    // 当日
    expect(subJapanDuration('2020-06-01', 'P1D', { excludeStartDate: true })).toEqual(generateDate('2020-05-31T00:00:00'))
    // 1週間
    expect(subJapanDuration('2021-03-07', 'P1W', { excludeStartDate: true })).toEqual(generateDate('2021-02-28T00:00:00'))
    // その他
    expect(subJapanDuration('2023-03-29', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2023-03-01T00:00:00')) // 143条2項 (平年)
    expect(subJapanDuration('2024-03-29', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-02-29T00:00:00')) // 143条2項 (閏年)
    expect(subJapanDuration('2023-03-29T01:00:00', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2023-03-01T00:00:00'))
    expect(subJapanDuration('2024-03-29T01:00:00', 'P1M', { excludeStartDate: true })).toEqual(generateDate('2024-02-29T00:00:00'))
    expect(subJapanDuration('2023-03-29T03:00:00', 'P1MT1H', { excludeStartDate: true })).toEqual(generateDate('2023-03-01T02:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'P1MT1H', { excludeStartDate: true })).toEqual(generateDate('2024-02-29T02:00:00'))

    // preserveTimeOnZero=trueかつ、PT0Sの場合は、excludeStartDateの設定に関わらず、時刻維持されること
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { excludeStartDate: true })).toEqual(generateDate('2024-03-29T00:00:00'))
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { excludeStartDate: true, preserveTimeOnZero: true })).toEqual(
      generateDate('2024-03-29T03:00:00'),
    )
    expect(subJapanDuration('2024-03-29T03:00:00', 'PT0S', { excludeStartDate: true, preserveTimeOnZero: false })).toEqual(
      generateDate('2024-03-29T00:00:00'),
    )
  })

  it('timezone', () => {
    const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)
    expect(subJapan(source, parseDuration('P1M'), { in: tz('Europe/Prague') }).toISOString()).toEqual('2020-07-31T00:00:00.000+02:00')
  })

  it('無効日', () => {
    expect(subJapan(new Date(Number.NaN), parseDuration('P1M'))).toEqual(new Date(Number.NaN))
  })
})
