import { isAfterDay } from '@/isAfterDay'
import { isBeforeDay } from '@/isBeforeDay'
import type { GtfsCalendar } from '@/types'
import type { ContextOptions, DateArg } from 'date-fns'
import { getDay } from 'date-fns/getDay'
import { isSameDay } from 'date-fns/isSameDay'

/**
 * The {@link isWithinGtfsCalendar} function options.
 */
export interface IsWithinGtfsCalendarOptions extends ContextOptions<Date> {}

/**
 * @name isWithinGtfsCalendar
 * @description
 * GTFSのカレンダーの範囲内か判定する
 *
 * @param date - The date to check
 * @param calendar - The GTFS calendar to check
 * @param options - An object with options
 *
 * @returns GTFSカレンダーの条件に合致する場合、true
 *
 * @example
 * const result = isWithinGtfsCalendar(new Date(2024, 10, 22), {
 *   startDate: new Date(2024, 10, 1),
 *   endDate: new Date(2024, 10, 30),
 *   fri: true,
 * })
 * //=> true
 */
export function isWithinGtfsCalendar(date: DateArg<Date> & {}, calendar: GtfsCalendar, options?: IsWithinGtfsCalendarOptions | undefined): boolean {
  // 期間外
  if (isBeforeDay(date, calendar.startDate, options) || isAfterDay(date, calendar.endDate, options)) {
    return false
  }
  // 対象外日
  if (calendar.excludes?.some((compareDate) => isSameDay(date, compareDate, options))) {
    return false
  }
  // 対象日
  if (calendar.includes?.some((compareDate) => isSameDay(date, compareDate, options))) {
    return true
  }
  // 曜日
  const day = getDay(date, options)
  const check = [calendar.sun, calendar.mon, calendar.tue, calendar.wed, calendar.thu, calendar.fri, calendar.sat]
  return check[day] ?? false
}
