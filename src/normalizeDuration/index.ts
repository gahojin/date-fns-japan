import type { Duration } from 'date-fns'

/**
 * @name normalizeDuration
 * @description
 * 期間を正規化する
 *
 * @param duration - The duration
 *
 * @returns The normalized duration
 *
 * @example
 * normalizeDuration({ days: 30, hours: 24 }) // { days: 31 }
 */
export function normalizeDuration(duration: Duration): Duration {
  // 秒
  let seconds: number = duration.seconds ?? 0
  let minutes = ~~(seconds / 60)
  seconds -= minutes * 60
  // 分
  minutes += duration.minutes ?? 0
  let hours = ~~(minutes / 60)
  minutes -= hours * 60
  // 時
  hours += duration.hours ?? 0
  let days = ~~(hours / 24)
  hours -= days * 24
  days += duration.days ?? 0

  // 月
  let months: number = duration.months ?? 0
  let years = ~~(months / 12)
  months -= years * 12
  years += duration.years ?? 0

  return {
    years: years === 0 ? undefined : years,
    months: months === 0 ? undefined : months,
    weeks: duration.weeks,
    days: days === 0 ? undefined : days,
    hours: hours === 0 ? undefined : hours,
    minutes: minutes === 0 ? undefined : minutes,
    seconds: seconds === 0 ? undefined : seconds,
  }
}
