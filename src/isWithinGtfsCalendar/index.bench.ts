import { bench, describe } from 'vitest'
import { isWithinGtfsCalendar } from './index'

describe('benchmark: isWithinGtfsCalendar', () => {
  bench('example', () => {
    isWithinGtfsCalendar(new Date(2024, 10, 22), { startDate: new Date(2024, 10, 1), endDate: new Date(2024, 10, 30), fri: true })
  })
})
