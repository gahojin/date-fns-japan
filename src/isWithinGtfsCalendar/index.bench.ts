import { test } from 'vitest'
import { isWithinGtfsCalendar } from './index.js'

test('benchmark: isWithinGtfsCalendar', async ({ bench }) => {
  await bench('isWithinGtfsCalendar', () => {
    isWithinGtfsCalendar(new Date(2024, 10, 22), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })
  }).run()
})
