---
slug: /sql-reference/aggregate-functions/reference/quantileexact
sidebar_position: 173
title: "quantileExact 関数"
description: "quantileExact, quantileExactLow, quantileExactHigh, quantileExactExclusive, quantileExactInclusive 関数"
---


# quantileExact 関数

## quantileExact {#quantileexact}

数値データシーケンスの[分位数](https://ja.wikipedia.org/wiki/分位数)を正確に計算します。

正確な値を得るために、すべての渡された値は配列に結合され、その後部分的にソートされます。したがって、この関数は `O(n)` のメモリを消費します。ここで、`n` は渡された値の数です。ただし、少数の値に対しては、この関数は非常に効果的です。

異なるレベルの `quantile*` 関数を複数使用する場合、内部状態は結合されません（つまり、クエリは効率的に動作しません）。この場合、[quantiles](../../../sql-reference/aggregate-functions/reference/quantiles.md#quantiles)関数を使用してください。

**構文**

``` sql
quantileExact(level)(expr)
```

エイリアス: `medianExact`。

**引数**

- `level` — 分位数のレベル。オプションのパラメータ。0から1までの定数浮動小数点数。`level` 値は `[0.01, 0.99]` の範囲で使用することを推奨します。デフォルト値: 0.5。`level=0.5` の場合、関数は[中央値](https://ja.wikipedia.org/wiki/中央値)を計算します。
- `expr` — カラムの値に対する式で、数値の[データ型](../../../sql-reference/data-types/index.md#data_types)、[Date](../../../sql-reference/data-types/date.md)または[DateTime](../../../sql-reference/data-types/datetime.md)を生成します。

**返される値**

- 指定されたレベルの分位数。

タイプ:

- 数値データ型の場合、出力形式は入力形式と同じになります。例えば:

```sql

SELECT
    toTypeName(quantileExact(number)) AS `quantile`,
    toTypeName(quantileExact(number::Int32)) AS `quantile_int32`,
    toTypeName(quantileExact(number::Float32)) AS `quantile_float32`,
    toTypeName(quantileExact(number::Float64)) AS `quantile_float64`,
    toTypeName(quantileExact(number::Int64)) AS `quantile_int64`
FROM numbers(1)


   ┌─quantile─┬─quantile_int32─┬─quantile_float32─┬─quantile_float64─┬─quantile_int64─┐
1. │ UInt64   │ Int32          │ Float32          │ Float64          │ Int64          │
   └──────────┴────────────────┴──────────────────┴──────────────────┴────────────────┘

1 行の結果。経過: 0.002 秒。
```

- [Date](../../../sql-reference/data-types/date.md) 型の入力値の場合。
- [DateTime](../../../sql-reference/data-types/datetime.md) 型の入力値の場合。

**例**

クエリ:

``` sql
SELECT quantileExact(number) FROM numbers(10)
```

結果:

``` text
┌─quantileExact(number)─┐
│                     5 │
└───────────────────────┘
```

## quantileExactLow {#quantileexactlow}

`quantileExact` に似ており、数値データシーケンスの正確な[分位数](https://ja.wikipedia.org/wiki/分位数)を計算します。

正確な値を得るために、すべての渡された値は配列に結合され、その後完全にソートされます。このソート[アルゴリズム](https://en.cppreference.com/w/cpp/algorithm/sort)の複雑度は `O(N·log(N))` で、ここで `N = std::distance(first, last)` 比較数です。

戻り値はわずかに分位数レベルと選択内の要素数に依存します。つまり、レベルが0.5の場合、関数は偶数個の要素に対しては下位中央値の値を返し、奇数個の要素に対しては中間中央値の値を返します。中央値は、Pythonで使用される[median_low](https://docs.python.org/3/library/statistics.html#statistics.median_low)の実装と同様に計算されます。

他のすべてのレベルについては、`level * size_of_array` の値に対応するインデックスの要素が返されます。例えば:

``` sql
SELECT quantileExactLow(0.1)(number) FROM numbers(10)

┌─quantileExactLow(0.1)(number)─┐
│                             1 │
└───────────────────────────────┘
```

異なるレベルの複数の `quantile*` 関数をクエリで使用する場合、内部状態は結合されません（つまり、クエリは効率的に動作しません）。この場合、[quantiles](/ru/sql-reference/aggregate-functions/reference/quantiles)関数を使用してください。

**構文**

``` sql
quantileExactLow(level)(expr)
```

エイリアス: `medianExactLow`。

**引数**

- `level` — 分位数のレベル。オプションのパラメータ。0から1までの定数浮動小数点数。`level` 値は `[0.01, 0.99]` の範囲で使用することを推奨します。デフォルト値: 0.5。`level=0.5` の場合、関数は[中央値](https://ja.wikipedia.org/wiki/中央値)を計算します。
- `expr` — カラムの値に対する式で、数値の[データ型](../../../sql-reference/data-types/index.md#data_types)、[Date](../../../sql-reference/data-types/date.md)または[DateTime](../../../sql-reference/data-types/datetime.md)を生成します。

**返される値**

- 指定されたレベルの分位数。

タイプ:

- 数値データ型入力の場合は[Float64](../../../sql-reference/data-types/float.md)。
- [Date](../../../sql-reference/data-types/date.md) 型の入力値の場合。
- [DateTime](../../../sql-reference/data-types/datetime.md) 型の入力値の場合。

**例**

クエリ:

``` sql
SELECT quantileExactLow(number) FROM numbers(10)
```

結果:

``` text
┌─quantileExactLow(number)─┐
│                        4 │
└──────────────────────────┘
```

## quantileExactHigh {#quantileexacthigh}

`quantileExact` に似ており、数値データシーケンスの正確な[分位数](https://ja.wikipedia.org/wiki/分位数)を計算します。

正確な値を得るために、渡されたすべての値は配列にまとめられ、その後完全にソートされます。このソート[アルゴリズム](https://en.cppreference.com/w/cpp/algorithm/sort)の複雑度は `O(N·log(N))` で、ここで `N = std::distance(first, last)` 比較数です。

戻り値は分位数レベルや選択内の要素数に依存します。つまり、レベルが0.5の場合、この関数は偶数個の要素に対しては上位中央値値を返し、奇数個の要素には中間中央値値を返します。中央値は、Pythonで使用される[median_high](https://docs.python.org/3/library/statistics.html#statistics.median_high)の実装に類似して計算されます。他のすべてのレベルに対しては、`level * size_of_array` の値に対応するインデックスの要素が返されます。

この実装は、現在の `quantileExact` 実装とまったく同じ動作をします。

異なるレベルの複数の `quantile*` 関数をクエリで使用する場合、内部状態は結合されません（つまり、クエリは効率的に動作しません）。この場合、[quantiles](../../../sql-reference/aggregate-functions/reference/quantiles.md#quantiles)関数を使用してください。

**構文**

``` sql
quantileExactHigh(level)(expr)
```

エイリアス: `medianExactHigh`。

**引数**

- `level` — 分位数のレベル。オプションのパラメータ。0から1までの定数浮動小数点数。`level` 値は `[0.01, 0.99]` の範囲で使用することを推奨します。デフォルト値: 0.5。`level=0.5` の場合、関数は[中央値](https://ja.wikipedia.org/wiki/中央値)を計算します。
- `expr` — カラムの値に対する式で、数値の[データ型](../../../sql-reference/data-types/index.md#data_types)、[Date](../../../sql-reference/data-types/date.md)または[DateTime](../../../sql-reference/data-types/datetime.md)を生成します。

**返される値**

- 指定されたレベルの分位数。

タイプ:

- 数値データ型入力の場合は[Float64](../../../sql-reference/data-types/float.md)。
- [Date](../../../sql-reference/data-types/date.md) 型の入力値の場合。
- [DateTime](../../../sql-reference/data-types/datetime.md) 型の入力値の場合。

**例**

クエリ:

``` sql
SELECT quantileExactHigh(number) FROM numbers(10)
```

結果:

``` text
┌─quantileExactHigh(number)─┐
│                         5 │
└───────────────────────────┘
```

## quantileExactExclusive {#quantileexactexclusive}

数値データシーケンスの[分位数](https://ja.wikipedia.org/wiki/分位数)を正確に計算します。

正確な値を得るために、渡されたすべての値は配列に結合され、その後部分的にソートされます。そのため、この関数は `O(n)` のメモリを消費します。ここで、`n` は渡された値の数ですが、少数の値に対してはこの関数は非常に効果的です。

この関数は、Excel 関数の[PERCENTILE.EXC](https://support.microsoft.com/en-us/office/percentile-exc-function-bbaa7204-e9e1-4010-85bf-c31dc5dce4ba)に相当します（[タイプ R6](https://ja.wikipedia.org/wiki/分位数#サンプルからの分位数の推定)）。

異なるレベルの複数の `quantileExactExclusive` 関数をクエリで使用する場合、内部状態は結合されません（つまり、クエリは効率的に動作しません）。この場合、[quantilesExactExclusive](../../../sql-reference/aggregate-functions/reference/quantiles.md#quantilesexactexclusive) 関数を使用してください。

**構文**

``` sql
quantileExactExclusive(level)(expr)
```

**引数**

- `expr` — カラムの値に対する式で、数値の[データ型](../../../sql-reference/data-types/index.md#data_types)、[Date](../../../sql-reference/data-types/date.md)または[DateTime](../../../sql-reference/data-types/datetime.md)を生成します。

**パラメータ**

- `level` — 分位数のレベル。オプション。可能な値: (0, 1) — 境界は含まれません。デフォルト値: 0.5。`level=0.5` の場合、関数は[中央値](https://ja.wikipedia.org/wiki/中央値)を計算します。 [Float](../../../sql-reference/data-types/float.md)。

**返される値**

- 指定されたレベルの分位数。

タイプ:

- 数値データ型入力の場合は[Float64](../../../sql-reference/data-types/float.md)。
- [Date](../../../sql-reference/data-types/date.md) 型の入力値の場合。
- [DateTime](../../../sql-reference/data-types/datetime.md) 型の入力値の場合。

**例**

クエリ:

``` sql
CREATE TABLE num AS numbers(1000);

SELECT quantileExactExclusive(0.6)(x) FROM (SELECT number AS x FROM num);
```

結果:

``` text
┌─quantileExactExclusive(0.6)(x)─┐
│                          599.6 │
└────────────────────────────────┘
```

## quantileExactInclusive {#quantileexactinclusive}

数値データシーケンスの[分位数](https://ja.wikipedia.org/wiki/分位数)を正確に計算します。

正確な値を得るために、渡されたすべての値は配列に結合され、その後部分的にソートされます。そのため、この関数は `O(n)` のメモリを消費します。ここで、`n` は渡された値の数ですが、少数の値に対してはこの関数は非常に効果的です。

この関数は、Excel 関数の[PERCENTILE.INC](https://support.microsoft.com/en-us/office/percentile-inc-function-680f9539-45eb-410b-9a5e-c1355e5fe2ed)に相当します（[タイプ R7](https://ja.wikipedia.org/wiki/分位数#サンプルからの分位数の推定)）。

異なるレベルの複数の `quantileExactInclusive` 関数をクエリで使用する場合、内部状態は結合されません（つまり、クエリは効率的に動作しません）。この場合、[quantilesExactInclusive](../../../sql-reference/aggregate-functions/reference/quantiles.md#quantilesexactinclusive) 関数を使用してください。

**構文**

``` sql
quantileExactInclusive(level)(expr)
```

**引数**

- `expr` — カラムの値に対する式で、数値の[データ型](../../../sql-reference/data-types/index.md#data_types)、[Date](../../../sql-reference/data-types/date.md)または[DateTime](../../../sql-reference/data-types/datetime.md)を生成します。

**パラメータ**

- `level` — 分位数のレベル。オプション。可能な値: [0, 1] — 境界が含まれます。デフォルト値: 0.5。`level=0.5` の場合、関数は[中央値](https://ja.wikipedia.org/wiki/中央値)を計算します。[Float](../../../sql-reference/data-types/float.md)。

**返される値**

- 指定されたレベルの分位数。

タイプ:

- 数値データ型入力の場合は[Float64](../../../sql-reference/data-types/float.md)。
- [Date](../../../sql-reference/data-types/date.md) 型の入力値の場合。
- [DateTime](../../../sql-reference/data-types/datetime.md) 型の入力値の場合。

**例**

クエリ:

``` sql
CREATE TABLE num AS numbers(1000);

SELECT quantileExactInclusive(0.6)(x) FROM (SELECT number AS x FROM num);
```

結果:

``` text
┌─quantileExactInclusive(0.6)(x)─┐
│                          599.4 │
└────────────────────────────────┘
```

**関連項目**

- [median](../../../sql-reference/aggregate-functions/reference/median.md#median)
- [quantiles](../../../sql-reference/aggregate-functions/reference/quantiles.md#quantiles)
