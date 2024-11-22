# date-fns-japan

date-fns対応の日本向けの日付処理プラグイン

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40gahojin-inc%2Fdate-fns-japan?activeTab=versions)](https://www.npmjs.com/package/@gahojin-inc/date-fns-japan)

## 機能

### addJapan

日本の民法(139〜143条(142条を除く))に沿った満了日時を算出する

```javascript
const result = addJapan(new Date(2020, 7, 31, 10, 19, 50), {
  years: 1,
  months: 3,
  weeks: 4,
  days: 3,
})
//=> Sat Jan 01 2022 00:00:00
```

### isAfterDay

指定された日が、比較対象日より後の日か返す

```javascript
const result = isAfterDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
//=> true
```

### isBeforeDay

指定された日が、比較対象日より前の日か返す

```javascript
const result = isBeforeDay(new Date(1989, 6, 10), new Date(1987, 1, 11))
//=> false
```

### normalizeDuration

Duration型を正規化する (24時間を1日にする等)

```javascript
const result = normalizeDuration({ days: 30, hours: 24 })
//=> { days: 31 }
```

## ライセンス

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

```
Copyright 2024, GAHOJIN, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
