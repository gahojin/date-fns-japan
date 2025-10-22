import type { ContextOptions, DateArg, Duration } from 'date-fns'
import { addDays } from 'date-fns/addDays'
import { addMonths } from 'date-fns/addMonths'
import { constructFrom } from 'date-fns/constructFrom'
import { startOfDay } from 'date-fns/startOfDay'
import { toDate } from 'date-fns/toDate'

/**
 * The {@link addJapan} function options.
 */
export interface AddJapanOptions<DateType extends Date = Date> extends ContextOptions<DateType> {
  /** 初日算入を行うか. 未指定やnull時は法令通り */
  readonly excludeStartDate?: boolean | null
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
  const { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = duration
  const { excludeStartDate } = options || {}

  let _date = toDate(date, options?.in)

  // 民法139条 時間により期間を定めた時は、その期間は、即時から起算する
  if (hours === 0 && minutes === 0 && seconds === 0) {
    let exclude = excludeStartDate
    if (typeof exclude !== 'boolean') {
      // 民法第140条により、起算日を算出 (初日不算入の原則により、翌日から起算する)
      // 00:00:00の場合、初日算入する(民法第140条ただし書)
      exclude = _date.getHours() !== 0 || _date.getMinutes() !== 0 || _date.getSeconds() !== 0 || _date.getMilliseconds() !== 0
    }
    if (exclude) {
      _date = startOfDay(addDays(_date, 1))
    } else {
      _date = startOfDay(_date)
    }
  }

  // 年月を加算し、応当日があるか判断する
  let dateWithMonths = addMonths(_date, months + years * 12)
  const existsAppropriateDate = dateWithMonths.getDate() === _date.getDate()
  if (!existsAppropriateDate) {
    // 応当日がない場合、翌日にする
    // 2020/08/31に1ヶ月加算の場合、addMonthsでは2020/09/30(その月の月末)が返ってくる
    // 満了日時を2020/09/30 24時とするため、+1日(翌日)とする (民法第143条)
    dateWithMonths = addDays(dateWithMonths, 1)
  }

  // 週と日を加算する
  const dateWithDays = days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths

  // 時、分、秒を加算する
  const minutesToAdd = minutes + hours * 60
  const secondsToAdd = seconds + minutesToAdd * 60
  const msToAdd = secondsToAdd * 1000

  return constructFrom(options?.in || date, +dateWithDays + msToAdd)
}
