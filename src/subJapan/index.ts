import type { ContextOptions, DateArg, Duration } from 'date-fns'
import { constructFrom } from 'date-fns/constructFrom'
import { subDays } from 'date-fns/subDays'
import { subMonths } from 'date-fns/subMonths'
import { toDate } from 'date-fns/toDate'
import { calcJapan } from '../_lib/calcJapan'

/**
 * The {@link subJapan} function options.
 */
export interface SubJapanOptions<DateType extends Date = Date> extends ContextOptions<DateType> {
  /** 初日算入を行うか. 未指定やnull時は法令通り */
  readonly excludeStartDate?: boolean | null
  /** 期間が0の場合に、時刻を維持するか. */
  readonly preserveTimeOnZero?: boolean
}

/**
 * @name subJapan
 * @description
 * 法令では、期間の減算は定められていないため、加算と類似の処理を行う
 *
 * @typeParam DateType - The `Date` type the function operates on. Gets inferred from passed arguments. Allows using extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param duration - The object with years, months, weeks, days, hours, minutes, and seconds to be subtracted.
 * @param options - An object with options
 *
 * @returns The new date with the seconds subtracted
 *
 * @example
 * // Subtract the following duration to 31 August 2020, 10:19:50
 * const result = subJapan(new Date(2020, 7, 31, 10, 19, 50), {
 *   years: 1,
 *   months: 3,
 *   weeks: 4,
 *   days: 3,
 * })
 * //=> Mon Apr 30 2019 00:00:00
 */
export function subJapan<DateType extends Date, ResultDate extends Date = DateType>(
  date: DateArg<DateType>,
  duration: Duration,
  options?: SubJapanOptions<ResultDate> | undefined,
): ResultDate {
  const [dateWithDays, msToSub] = calcJapan(toDate(date, options?.in), duration, false, subMonths, subDays, options)

  return constructFrom(options?.in || date, +dateWithDays - msToSub)
}
