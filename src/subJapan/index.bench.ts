import { TZDate } from '@date-fns/tz'
import type { Duration } from 'date-fns'
import { bench, describe } from 'vitest'
import { subJapan } from './index'

const TZ = 'Asia/Tokyo'

describe('benchmark: addJapan', () => {
  // Mon Aug 31 2020 10:19:50 + 1years,3months,2days,4weeks,5hours,6minutes,7seconds
  const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)
  const duration: Duration = {
    years: 1,
    months: 3,
    weeks: 4,
    days: 3,
  }

  bench('example', () => {
    subJapan(source, duration)
  })
})
