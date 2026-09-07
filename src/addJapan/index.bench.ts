import { TZDate } from '@date-fns/tz'
import type { Duration } from 'date-fns'
import { test } from 'vitest'
import { addJapan } from './index.js'

const TZ = 'Asia/Tokyo'

test('benchmark: addJapan', async ({ bench }) => {
  // Mon Aug 31 2020 10:19:50 + 1years,3months,2days,4weeks,5hours,6minutes,7seconds
  const source = new TZDate(2020, 7, 31, 10, 19, 50, TZ)
  const duration: Duration = {
    years: 1,
    months: 3,
    weeks: 4,
    days: 3,
  }

  await bench('addJapan', () => {
    addJapan(source, duration)
  }).run()
})
