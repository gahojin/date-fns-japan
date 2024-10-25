import { TZDate } from '@date-fns/tz'
import type { Duration } from 'date-fns'
import { add } from 'date-fns/add'
import { parse } from 'iso8601-duration'
import { addJapan } from './index'

const TZ = 'Asia/Tokyo'

const addJapanDuration = (date: string, duration: string): Date => {
  return addJapan(new TZDate(date, TZ), parse(duration))
}

describe('addJapan', () => {
  it('example', () => {
    // Mon Aug 31 2020 10:19:50 + 1years,3months,2days,4weeks,5hours,6minutes,7seconds
    const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)
    const duration: Duration = {
      years: 1,
      months: 3,
      weeks: 4,
      days: 3,
    }
    const resultAdd = add(source, duration)
    const resultAddJapan = addJapan(source, duration)
    // Sat Jan 01 2022 00:00:00
    expect(resultAddJapan).toEqual(new Date(2022, 0, 1, 0, 0, 0))
    // Fri Dec 31 2021 10:19:50
    expect(resultAdd).toEqual(new Date(2021, 11, 31, 10, 19, 50))
  })

  it('民法に沿っているか', () => {
    // 当日
    expect(addJapanDuration('2020/06/01', 'P1D')).toEqual(new TZDate('2020/06/02 00:00:00', TZ))
    // 2日間
    expect(addJapanDuration('2020/06/01', 'P2D')).toEqual(new TZDate('2020/06/03 00:00:00', TZ))
    // 月末/2日間
    expect(addJapanDuration('2020/06/30', 'P2D')).toEqual(new TZDate('2020/07/02 00:00:00', TZ))
    // 1ヶ月
    expect(addJapanDuration('2020/06/01', 'P1M')).toEqual(new TZDate('2020/07/01 00:00:00', TZ))
    expect(addJapanDuration('2020/08/31', 'P1M')).toEqual(new TZDate('2020/10/01 00:00:00', TZ))
    expect(addJapanDuration('2020/10/10', 'P1M')).toEqual(new TZDate('2020/11/10 00:00:00', TZ))
    expect(addJapanDuration('2020/12/01', 'P1M')).toEqual(new TZDate('2021/01/01 00:00:00', TZ))
    expect(addJapanDuration('2021/01/31', 'P1M')).toEqual(new TZDate('2021/03/01 00:00:00', TZ))
    expect(addJapanDuration('2022/02/28', 'P1M')).toEqual(new TZDate('2022/03/28 00:00:00', TZ))
    expect(addJapanDuration('2024/01/29', 'P1M')).toEqual(new TZDate('2024/02/29 00:00:00', TZ))
    expect(addJapanDuration('2024/01/30', 'P1M')).toEqual(new TZDate('2024/03/01 00:00:00', TZ))
    expect(addJapanDuration('2024/01/31', 'P1M')).toEqual(new TZDate('2024/03/01 00:00:00', TZ))
    expect(addJapanDuration('2024/02/01', 'P1M')).toEqual(new TZDate('2024/03/01 00:00:00', TZ))
    expect(addJapanDuration('2024/03/01', 'P1M')).toEqual(new TZDate('2024/04/01 00:00:00', TZ))
    // 1ヶ月 1日
    expect(addJapanDuration('2020/06/01', 'P1M1D')).toEqual(new TZDate('2020/07/02 00:00:00', TZ))
    expect(addJapanDuration('2020/08/31', 'P1M1D')).toEqual(new TZDate('2020/10/02 00:00:00', TZ))
    expect(addJapanDuration('2020/10/10', 'P1M1D')).toEqual(new TZDate('2020/11/11 00:00:00', TZ))
    expect(addJapanDuration('2020/12/01', 'P1M1D')).toEqual(new TZDate('2021/01/02 00:00:00', TZ))
    expect(addJapanDuration('2021/01/31', 'P1M1D')).toEqual(new TZDate('2021/03/02 00:00:00', TZ))
    expect(addJapanDuration('2021/02/28', 'P1M1D')).toEqual(new TZDate('2021/03/29 00:00:00', TZ))
    expect(addJapanDuration('2024/01/29', 'P1M1D')).toEqual(new TZDate('2024/03/01 00:00:00', TZ))
    expect(addJapanDuration('2024/01/30', 'P1M1D')).toEqual(new TZDate('2024/03/02 00:00:00', TZ))
    expect(addJapanDuration('2024/01/31', 'P1M1D')).toEqual(new TZDate('2024/03/02 00:00:00', TZ))
    expect(addJapanDuration('2024/02/01', 'P1M1D')).toEqual(new TZDate('2024/03/02 00:00:00', TZ))
    expect(addJapanDuration('2024/03/01', 'P1M1D')).toEqual(new TZDate('2024/04/02 00:00:00', TZ))
    // 3ヶ月
    expect(addJapanDuration('2020/06/01', 'P3M')).toEqual(new TZDate('2020/09/01 00:00:00', TZ))
    expect(addJapanDuration('2020/08/31', 'P3M')).toEqual(new TZDate('2020/12/01 00:00:00', TZ))
    expect(addJapanDuration('2020/10/10', 'P3M')).toEqual(new TZDate('2021/01/10 00:00:00', TZ))
    expect(addJapanDuration('2020/12/01', 'P3M')).toEqual(new TZDate('2021/03/01 00:00:00', TZ))
    expect(addJapanDuration('2021/01/31', 'P3M')).toEqual(new TZDate('2021/05/01 00:00:00', TZ))
    expect(addJapanDuration('2021/02/28', 'P3M')).toEqual(new TZDate('2021/05/28 00:00:00', TZ))
    // 6ヶ月
    expect(addJapanDuration('2020/06/01', 'P6M')).toEqual(new TZDate('2020/12/01 00:00:00', TZ))
    expect(addJapanDuration('2020/08/31', 'P6M')).toEqual(new TZDate('2021/03/01 00:00:00', TZ))
    expect(addJapanDuration('2020/10/10', 'P6M')).toEqual(new TZDate('2021/04/10 00:00:00', TZ))
    expect(addJapanDuration('2020/12/01', 'P6M')).toEqual(new TZDate('2021/06/01 00:00:00', TZ))
    expect(addJapanDuration('2021/01/31', 'P6M')).toEqual(new TZDate('2021/07/31 00:00:00', TZ))
    expect(addJapanDuration('2021/02/28', 'P6M')).toEqual(new TZDate('2021/08/28 00:00:00', TZ))
    // 1週間
    expect(addJapanDuration('2021/02/28', 'P1W')).toEqual(new TZDate('2021/03/07 00:00:00', TZ))
    // その他
    expect(addJapanDuration('2023/01/01', 'P2M')).toEqual(new TZDate('2023/03/01 00:00:00', TZ)) // 143条2項 (平年)
    expect(addJapanDuration('2024/01/01', 'P2M')).toEqual(new TZDate('2024/03/01 00:00:00', TZ)) // 143条2項 (閏年)
    expect(addJapanDuration('2024/01/20', 'P2M')).toEqual(new TZDate('2024/03/20 00:00:00', TZ)) // 143条2項
    expect(addJapanDuration('2024/01/31', 'P2M')).toEqual(new TZDate('2024/03/31 00:00:00', TZ)) // 143条2項
    expect(addJapanDuration('2023/01/31', 'P1M')).toEqual(new TZDate('2023/03/01 00:00:00', TZ)) // 143条2項ただし書 (平年)
    expect(addJapanDuration('2024/01/31', 'P1M')).toEqual(new TZDate('2024/03/01 00:00:00', TZ)) // 143条2項ただし書 (閏年)
    expect(addJapanDuration('2024/03/31', 'P1M')).toEqual(new TZDate('2024/05/01 00:00:00', TZ)) // 143条2項ただし書
    expect(addJapanDuration('2024/03/31', 'P1M')).toEqual(new TZDate('2024/05/01 00:00:00', TZ)) // 143条2項ただし書
    expect(addJapanDuration('2024/05/30 01:00:00', 'P1M')).toEqual(new TZDate('2024/07/01 00:00:00', TZ))
    expect(addJapanDuration('2024/05/30 01:00:00', 'P1MT1H')).toEqual(new TZDate('2024/06/30 02:00:00', TZ))
    expect(addJapanDuration('2023/01/29', 'P1M')).toEqual(new TZDate('2023/03/01 00:00:00', TZ))
    expect(addJapanDuration('2020/02/28', 'P1Y')).toEqual(new TZDate('2021/02/28 00:00:00', TZ))
    expect(addJapanDuration('2020/02/28 01:00:00', 'P1Y')).toEqual(new TZDate('2021/03/01 00:00:00', TZ))
    expect(addJapanDuration('2020/08/15', 'P1Y3M')).toEqual(new TZDate('2021/11/15 00:00:00', TZ))
    expect(addJapanDuration('2020/08/31', 'P1Y1M')).toEqual(new TZDate('2021/10/01 00:00:00', TZ))
    expect(addJapanDuration('2024/06/01 18:00', 'PT30H')).toEqual(new TZDate('2024/06/03 00:00:00', TZ))
    expect(addJapanDuration('2024/06/01', 'P2Y')).toEqual(new TZDate('2026/06/01 00:00:00', TZ))
  })
})
