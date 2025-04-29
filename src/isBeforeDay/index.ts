import type { ContextOptions, DateArg } from 'date-fns'
import { startOfDay } from 'date-fns/startOfDay'
import { normalizeDates } from '../_lib/normalize'

/**
 * The {@link isBeforeDay} function options.
 */
export interface IsBeforeDayOptions extends ContextOptions<Date> {}

/**
 * @name isBeforeDay
 * @description
 * 指定した日より前の日か取得する
 *
 * @param date - The date that should be after the other one to return true
 * @param dateToCompare - The date to compare with
 *
 * @returns The first date is after the second date
 *
 * @example
 * // Is 10 July 1989 after 11 February 1987?
 * const result = isBeforeDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> false
 */
export function isBeforeDay(date: DateArg<Date> & {}, dateToCompare: DateArg<Date> & {}, options?: IsBeforeDayOptions | undefined): boolean {
  const [dateLeft_, dateRight_] = normalizeDates(options?.in, date, dateToCompare)
  return +startOfDay(dateLeft_) < +startOfDay(dateRight_)
}
