export interface GtfsCalendar {
  /** 期間開始日 */
  startDate: Date
  /** 期間終了日 */
  endDate: Date
  /** 月曜日 */
  mon?: boolean | undefined | null
  /** 火曜日 */
  tue?: boolean | undefined | null
  /** 水曜日 */
  wed?: boolean | undefined | null
  /** 木曜日 */
  thu?: boolean | undefined | null
  /** 金曜日 */
  fri?: boolean | undefined | null
  /** 土曜日 */
  sat?: boolean | undefined | null
  /** 日曜日 */
  sun?: boolean | undefined | null
  /** 対象日 (期間内の日付であること) */
  includes?: Date[] | undefined | null
  /** 対象外日 (期間内の日付であること) */
  excludes?: Date[] | undefined | null
}
