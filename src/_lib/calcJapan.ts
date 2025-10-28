import { type Duration, startOfDay } from 'date-fns'
import { addDays } from 'date-fns/addDays'

export type Options = {
  /** 初日算入を行うか. 未指定やnull時は法令通り */
  readonly excludeStartDate?: boolean | null
  /** 期間が0の場合に、時刻を維持するか. */
  readonly preserveTimeOnZero?: boolean
}

export const calcJapan = (
  date: Date,
  duration: Duration,
  excludeAddDay: boolean,
  calcMonths: (date: Date, amount: number) => Date,
  calcDays: (date: Date, amount: number) => Date,
  options?: Options | undefined,
): [Date, number] => {
  const { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = duration
  const { excludeStartDate, preserveTimeOnZero } = options || {}

  let _date = date

  // 民法139条 時間により期間を定めた時は、その期間は、即時から起算する
  if (hours === 0 && minutes === 0 && seconds === 0) {
    // 減算する場合、0秒と0日が判別出来ないため、フラグによって、0:00にするかを決定する
    if (years !== 0 || months !== 0 || weeks !== 0 || days !== 0 || preserveTimeOnZero !== true) {
      let exclude = excludeStartDate
      if (typeof exclude !== 'boolean') {
        // 民法第140条により、起算日を算出 (初日不算入の原則により、翌日から起算する)
        // 00:00:00の場合、初日算入する(民法第140条ただし書)
        exclude = date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0
      }
      _date = startOfDay(excludeAddDay === exclude ? addDays(_date, 1) : _date)
    }
  }

  // 年月を加算し、応当日があるか判断する
  let dateWithMonths = calcMonths(_date, months + years * 12)
  const existsAppropriateDate = dateWithMonths.getDate() === _date.getDate()
  if (!existsAppropriateDate) {
    // 応当日がない場合、翌日にする
    // 2020/08/31に1ヶ月加算の場合、addMonthsでは2020/09/30(その月の月末)が返ってくる
    // 満了日時を2020/09/30 24時とするため、+1日(翌日)とする (民法第143条)
    dateWithMonths = addDays(dateWithMonths, 1)
  }

  // 週と日を加算する
  const dateWithDays = days || weeks ? calcDays(dateWithMonths, days + weeks * 7) : dateWithMonths

  // 時、分、秒を加算する
  const minutesToAdd = minutes + hours * 60
  const secondsToAdd = seconds + minutesToAdd * 60
  const msToAdd = secondsToAdd * 1000

  return [dateWithDays, msToAdd]
}
