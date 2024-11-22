import { isAfterDay } from '@/isAfterDay'
import { isBeforeDay } from '@/isBeforeDay'
import type { ContextOptions, DateArg } from 'date-fns'
import { getDay } from 'date-fns/getDay'
import { isSameDay } from 'date-fns/isSameDay'

/**
 * The {@link isWithinInterval} function options.
 */
export interface IsWithinGtfsCalendarOptions extends ContextOptions<Date> {}

export interface GtfsCalendar {
  /** 期間開始日 */
  startDate: Date
  /** 期間終了日 */
  endDate: Date
  /** 月曜日 */
  mon?: boolean | undefined
  /** 火曜日 */
  tue?: boolean | undefined
  /** 水曜日 */
  wed?: boolean | undefined
  /** 木曜日 */
  thu?: boolean | undefined
  /** 金曜日 */
  fri?: boolean | undefined
  /** 土曜日 */
  sat?: boolean | undefined
  /** 日曜日 */
  sun?: boolean | undefined
  /** 対象日 (期間内の日付であること) */
  includes?: Date[] | undefined
  /** 対象外日 (期間内の日付であること) */
  excludes?: Date[] | undefined
}

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
  if (calendar?.excludes?.some((compareDate) => isSameDay(date, compareDate, options))) {
    return false
  }
  // 対象日
  if (calendar?.includes?.some((compareDate) => isSameDay(date, compareDate, options))) {
    return true
  }
  // 曜日
  const day = getDay(date, options)
  const check = [calendar.sun, calendar.mon, calendar.tue, calendar.wed, calendar.thu, calendar.fri, calendar.sat]
  return check[day] ?? false
}
