import type { ContextOptions, DateArg, Duration } from 'date-fns'
import { addDays } from 'date-fns/addDays'
import { addMonths } from 'date-fns/addMonths'
import { constructFrom } from 'date-fns/constructFrom'
import { toDate } from 'date-fns/toDate'
import { calcJapan } from '../_lib/calcJapan'

/**
 * The {@link addJapan} function options.
 */
export interface AddJapanOptions<DateType extends Date = Date> extends ContextOptions<DateType> {
  /** 初日算入を行うか. 未指定やnull時は法令通り */
  readonly excludeStartDate?: boolean | null
  /** 期間が0の場合に、時刻を維持するか. */
  readonly preserveTimeOnZero?: boolean
}

export function addJapan<DateType extends Date, ResultDate extends Date = DateType>(
  date: DateArg<DateType>,
  duration: Duration,
  options?: AddJapanOptions<ResultDate> | undefined,
): ResultDate {
  const [dateWithDays, msToAdd] = calcJapan(toDate(date, options?.in), duration, true, addMonths, addDays, options)

  return constructFrom(options?.in || date, +dateWithDays + msToAdd)
}
