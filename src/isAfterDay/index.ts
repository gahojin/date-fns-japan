import { normalizeDates } from '@/_lib/normalize'
import type { ContextOptions, DateArg } from 'date-fns'
import { startOfDay } from 'date-fns/startOfDay'

/**
 * The {@link isAfterDay} function options.
 */
export interface IsAfterDayOptions extends ContextOptions<Date> {}

/**
 * @name isAfterDay
 * @description
 * 指定した日より後の日か取得する
 *
 * @param date - The date that should be after the other one to return true
 * @param dateToCompare - The date to compare with
 *
 * @returns The first date is after the second date
 *
 * @example
 * // Is 10 July 1989 after 11 February 1987?
 * const result = isAfterDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
 * //=> true
 */
export function isAfterDay(date: DateArg<Date> & {}, dateToCompare: DateArg<Date> & {}, options?: IsAfterDayOptions | undefined): boolean {
  const [dateLeft_, dateRight_] = normalizeDates(options?.in, date, dateToCompare)
  return +startOfDay(dateLeft_) > +startOfDay(dateRight_)
}
