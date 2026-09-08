import type { ContextOptions, DateArg, Duration } from 'date-fns'
import { addDays } from 'date-fns/addDays'
import { addMonths } from 'date-fns/addMonths'
import { constructFrom } from 'date-fns/constructFrom'
import { toDate } from 'date-fns/toDate'
import { calcJapan } from '~/_lib/calcJapan.js'

/**
 * The {@link addJapan} function options.
 */
export interface AddJapanOptions<DateType extends Date = Date> extends ContextOptions<DateType> {
  /** 初日算入を行うか. 未指定やnull時は法令通り */
  readonly excludeStartDate?: boolean | null
  /** 期間が0の場合に、時刻を維持するか. */
  readonly preserveTimeOnZero?: boolean
}

/**
 * @name addJapan
 * @description
 * 日本の民法に定められた期間の計算を考慮し、計算を行う
 *
 * 民法第139条
 *  - 時間によって期間を定めたときは、その期間は、即時から起算する。
 * 民法第140条
 *  - 日、週、月又は年によって期間を定めたときは、期間の初日は、算入しない。
 *    ただし、その期間が午前零時から始まるときは、この限りでない。
 * 民法第141条
 *  - 前条の場合には、期間は、その末日の終了をもって満了する。
 * 民法第143条
 *  - 週、月又は年によって期間を定めたときは、その期間は、暦に従って計算する。
 *  - 週、月又は年の初めから期間を起算しないときは、その期間は、最後の週、月又は年においてその起算日に応当する日の前日に満了する。
 *    ただし、月又は年によって期間を定めた場合において、最後の月に応当する日がないときは、その月の末日に満了する。
 *
 * @typeParam DateType - The `Date` type the function operates on. Gets inferred from passed arguments. Allows using extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param duration - The object with years, months, weeks, days, hours, minutes, and seconds to be added.
 * @param options - An object with options
 *
 * @returns The new date with the seconds added
 *
 * @example
 * // Add the following duration to 31 August 2020, 10:19:50
 * const result = addJapan(new Date(2020, 7, 31, 10, 19, 50), {
 *   years: 1,
 *   months: 3,
 *   weeks: 4,
 *   days: 3,
 * })
 * //=> Sat Jan 01 2022 00:00:00
 */
export function addJapan<DateType extends Date, ResultDate extends Date = DateType>(
  date: DateArg<DateType>,
  duration: Duration,
  options?: AddJapanOptions<ResultDate> | undefined,
): ResultDate {
  const [dateWithDays, msToAdd] = calcJapan(toDate(date, options?.in), duration, true, addMonths, addDays, options)

  return constructFrom(options?.in || date, +dateWithDays + msToAdd)
}
