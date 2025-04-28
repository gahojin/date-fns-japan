import type { ContextFn, DateArg } from 'date-fns'
import { constructFrom } from 'date-fns/constructFrom'

export function normalizeDates(context: ContextFn<Date> | undefined, ...dates: Array<DateArg<Date> & {}>): Date[] {
  const normalize = constructFrom.bind(null, context || dates.find((date) => typeof date === 'object'))
  return dates.map(normalize)
}
