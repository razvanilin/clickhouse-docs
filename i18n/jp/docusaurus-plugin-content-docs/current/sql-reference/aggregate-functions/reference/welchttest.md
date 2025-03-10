---
slug: /sql-reference/aggregate-functions/reference/welchttest
sidebar_position: 214
sidebar_label: welchTTest
title: "welchTTest"
description: "二つの母集団からのサンプルに Welch の t 検定を適用します。"
---


# welchTTest

二つの母集団からのサンプルに Welch の t 検定を適用します。

**構文**

``` sql
welchTTest([confidence_level])(sample_data, sample_index)
```

両方のサンプルの値は `sample_data` カラムにあります。`sample_index` が 0 の場合、その行の値は最初の母集団からのサンプルに属します。それ以外の場合、その値は第二の母集団からのサンプルに属します。
帰無仮説は、母集団の平均が等しいことです。正規分布が仮定されます。母集団は分散が異なる場合があります。

**引数**

- `sample_data` — サンプルデータ。[整数](../../../sql-reference/data-types/int-uint.md)、[浮動小数点](../../../sql-reference/data-types/float.md) または [小数](../../../sql-reference/data-types/decimal.md)。
- `sample_index` — サンプルインデックス。[整数](../../../sql-reference/data-types/int-uint.md)。

**パラメータ**

- `confidence_level` — 信頼区間を計算するための信頼レベル。[浮動小数点](../../../sql-reference/data-types/float.md)。

**返される値**

[タプル](../../../sql-reference/data-types/tuple.md)として2つまたは4つの要素（オプションの `confidence_level` が指定された場合）

- 計算された t 統計量。[Float64](../../../sql-reference/data-types/float.md)。
- 計算された p 値。[Float64](../../../sql-reference/data-types/float.md)。
- 計算された信頼区間下限。[Float64](../../../sql-reference/data-types/float.md)。
- 計算された信頼区間上限。[Float64](../../../sql-reference/data-types/float.md)。

**例**

入力テーブル:

``` text
┌─sample_data─┬─sample_index─┐
│        20.3 │            0 │
│        22.1 │            0 │
│        21.9 │            0 │
│        18.9 │            1 │
│        20.3 │            1 │
│          19 │            1 │
└─────────────┴──────────────┘
```

クエリ:

``` sql
SELECT welchTTest(sample_data, sample_index) FROM welch_ttest;
```

結果:

``` text
┌─welchTTest(sample_data, sample_index)─────┐
│ (2.7988719532211235,0.051807360348581945) │
└───────────────────────────────────────────┘
```

**関連情報**

- [Welch の t 検定](https://en.wikipedia.org/wiki/Welch%27s_t-test)
- [studentTTest 関数](studentttest.md#studentttest)
