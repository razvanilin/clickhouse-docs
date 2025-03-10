---
slug: /sql-reference/functions/type-conversion-functions
sidebar_position: 185
sidebar_label: 型変換
---

# 型変換関数
## データ変換に関する一般的な問題 {#common-issues-with-data-conversion}

ClickHouseは一般的に、[C++プログラムと同じ動作を使用します。](https://en.cppreference.com/w/cpp/language/implicit_conversion)

`to<type>`関数と[cast](#cast)は、一部のケースで異なる動作をします。例えば、[LowCardinality](../data-types/lowcardinality.md)の場合： [cast](#cast)では[LowCardinality](../data-types/lowcardinality.md)の特性が削除されますが、`to<type>`関数では削除されません。同様に、[Nullable](../data-types/nullable.md)の場合も同様であり、この動作はSQL標準と互換性がなく、[cast_keep_nullable](../../operations/settings/settings.md/#cast_keep_nullable)設定を使用して変更できます。

:::note
データ型の値がより小さいデータ型に変換される場合（例えば、`Int64`から`Int32`へ）や、互換性のないデータ型の間で変換される場合（例えば、`String`から`Int`へ）に、潜在的なデータ損失に注意してください。結果が期待通りであるかを注意深く確認してください。
:::

例：

```sql
SELECT
    toTypeName(toLowCardinality('') AS val) AS source_type,
    toTypeName(toString(val)) AS to_type_result_type,
    toTypeName(CAST(val, 'String')) AS cast_result_type

┌─source_type────────────┬─to_type_result_type────┬─cast_result_type─┐
│ LowCardinality(String) │ LowCardinality(String) │ String           │
└────────────────────────┴────────────────────────┴──────────────────┘

SELECT
    toTypeName(toNullable('') AS val) AS source_type,
    toTypeName(toString(val)) AS to_type_result_type,
    toTypeName(CAST(val, 'String')) AS cast_result_type

┌─source_type──────┬─to_type_result_type─┬─cast_result_type─┐
│ Nullable(String) │ Nullable(String)    │ String           │
└──────────────────┴─────────────────────┴──────────────────┘

SELECT
    toTypeName(toNullable('') AS val) AS source_type,
    toTypeName(toString(val)) AS to_type_result_type,
    toTypeName(CAST(val, 'String')) AS cast_result_type
SETTINGS cast_keep_nullable = 1

┌─source_type──────┬─to_type_result_type─┬─cast_result_type─┐
│ Nullable(String) │ Nullable(String)    │ Nullable(String) │
└──────────────────┴─────────────────────┴──────────────────┘
```
## toBool {#tobool}

入力値を [`Bool`](../data-types/boolean.md) 型の値に変換します。エラーの際には例外をスローします。

**構文**

```sql
toBool(expr)
```

**引数**

- `expr` — 数字または文字列を返す式。[式](../syntax.md/#syntax-expressions)。

サポートされる引数：
- (U)Int8/16/32/64/128/256型の値。
- Float32/64型の値。
- 文字列 `true` または `false`（大文字小文字を区別しない）。

**返される値**

- 引数の評価に基づいて `true` または `false` を返します。[Bool](../data-types/boolean.md)。

**例**

クエリ：

```sql
SELECT
    toBool(toUInt8(1)),
    toBool(toInt8(-1)),
    toBool(toFloat32(1.01)),
    toBool('true'),
    toBool('false'),
    toBool('FALSE')
FORMAT Vertical
```

結果：

```response
toBool(toUInt8(1)):      true
toBool(toInt8(-1)):      true
toBool(toFloat32(1.01)): true
toBool('true'):          true
toBool('false'):         false
toBool('FALSE'):         false
```
## toInt8 {#toint8}

入力値を [`Int8`](../data-types/int-uint.md) 型の値に変換します。エラーの際には例外をスローします。

**構文**

```sql
toInt8(expr)
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions)。

サポートされる引数：
- (U)Int8/16/32/64/128/256型の値または文字列表現。
- Float32/64型の値。

サポートされない引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt8('0xc0fe');`。

:::note
入力値が [Int8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
例えば： `SELECT toInt8(128) == -128;`。
:::

**返される値**

- 8ビット整数値。[Int8](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

```sql
SELECT
    toInt8(-8),
    toInt8(-8.8),
    toInt8('-8')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt8(-8):   -8
toInt8(-8.8): -8
toInt8('-8'): -8
```

**参照**

- [`toInt8OrZero`](#toint8orzero)。
- [`toInt8OrNull`](#toInt8OrNull)。
- [`toInt8OrDefault`](#toint8ordefault)。
## toInt8OrZero {#toint8orzero}

[`toInt8`](#toint8) と同様に、この関数は入力値を [Int8](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `0` を返します。

**構文**

```sql
toInt8OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`0`を返す）：
- 通常のFloat32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt8OrZero('0xc0fe');`。

:::note
入力値が [Int8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は8ビット整数値、そうでない場合は `0`。[Int8](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt8OrZero('-8'),
    toInt8OrZero('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt8OrZero('-8'):  -8
toInt8OrZero('abc'): 0
```

**参照**

- [`toInt8`](#toint8)。
- [`toInt8OrNull`](#toInt8OrNull)。
- [`toInt8OrDefault`](#toint8ordefault)。
## toInt8OrNull {#toInt8OrNull}

[`toInt8`](#toint8) と同様に、この関数は入力値を [Int8](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `NULL` を返します。

**構文**

```sql
toInt8OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`\\N`を返す）
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt8OrNull('0xc0fe');`。

:::note
入力値が [Int8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は8ビット整数値、そうでない場合は `NULL`。[Int8](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt8OrNull('-8'),
    toInt8OrNull('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt8OrNull('-8'):  -8
toInt8OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toInt8`](#toint8)。
- [`toInt8OrZero`](#toint8orzero)。
- [`toInt8OrDefault`](#toint8ordefault)。
## toInt8OrDefault {#toint8ordefault}

[`toInt8`](#toint8) と同様に、この関数は入力値を [Int8](../data-types/int-uint.md) 型の値に変換しますが、エラーの際にはデフォルト値を返します。
`default` 値が渡されない場合は、エラーの際には `0` が返されます。

**構文**

```sql
toInt8OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` （オプション） — `Int8`型への解析が失敗した場合に返されるデフォルト値。[Int8](../data-types/int-uint.md)。

サポートされる引数：
- (U)Int8/16/32/64/128/256 の型の値または文字列表現。
- Float32/64型の値。

デフォルト値が返される引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt8OrDefault('0xc0fe', CAST('-1', 'Int8'));`。

:::note
入力値が [Int8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は8ビット整数値、そうでない場合は渡されたデフォルト値、または渡されなければ `0`。[Int8](../data-types/int-uint.md)。

:::note
- この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ：

``` sql
SELECT
    toInt8OrDefault('-8', CAST('-1', 'Int8')),
    toInt8OrDefault('abc', CAST('-1', 'Int8'))
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt8OrDefault('-8', CAST('-1', 'Int8')):  -8
toInt8OrDefault('abc', CAST('-1', 'Int8')): -1
```

**参照**

- [`toInt8`](#toint8)。
- [`toInt8OrZero`](#toint8orzero)。
- [`toInt8OrNull`](#toInt8OrNull)。
## toInt16 {#toint16}

入力値を [`Int16`](../data-types/int-uint.md) 型の値に変換します。エラーの際には例外をスローします。

**構文**

```sql
toInt16(expr)
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions)。

サポートされる引数：
- (U)Int8/16/32/64/128/256型の値または文字列表現。
- Float32/64型の値。

サポートされない引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt16('0xc0fe');`。

:::note
入力値が [Int16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
例えば： `SELECT toInt16(32768) == -32768;`。
:::

**返される値**

- 16ビット整数値。[Int16](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

```sql
SELECT
    toInt16(-16),
    toInt16(-16.16),
    toInt16('-16')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt16(-16):    -16
toInt16(-16.16): -16
toInt16('-16'):  -16
```

**参照**

- [`toInt16OrZero`](#toint16orzero)。
- [`toInt16OrNull`](#toint16ornull)。
- [`toInt16OrDefault`](#toint16ordefault)。
## toInt16OrZero {#toint16orzero}

[`toInt16`](#toint16) と同様に、この関数は入力値を [Int16](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `0` を返します。

**構文**

```sql
toInt16OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`0`を返す）：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt16OrZero('0xc0fe');`。

:::note
入力値が [Int16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 16ビット整数値が成功した場合、そうでない場合は `0`。[Int16](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt16OrZero('-16'),
    toInt16OrZero('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt16OrZero('-16'): -16
toInt16OrZero('abc'): 0
```

**参照**

- [`toInt16`](#toint16)。
- [`toInt16OrNull`](#toint16ornull)。
- [`toInt16OrDefault`](#toint16ordefault)。
## toInt16OrNull {#toint16ornull}

[`toInt16`](#toint16) と同様に、この関数は入力値を [Int16](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `NULL` を返します。

**構文**

```sql
toInt16OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`\\N`を返す）
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt16OrNull('0xc0fe');`。

:::note
入力値が [Int16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は16ビット整数値、そうでない場合は `NULL`。[Int16](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt16OrNull('-16'),
    toInt16OrNull('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt16OrNull('-16'): -16
toInt16OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toInt16`](#toint16)。
- [`toInt16OrZero`](#toint16orzero)。
- [`toInt16OrDefault`](#toint16ordefault)。
## toInt16OrDefault {#toint16ordefault}

[`toInt16`](#toint16) と同様に、この関数は入力値を [Int16](../data-types/int-uint.md) 型の値に変換しますが、エラーの際にはデフォルト値を返します。
デフォルト値が渡されない場合は、エラーの際には `0` が返されます。

**構文**

```sql
toInt16OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` （オプション） — `Int16`型への解析が失敗した場合に返されるデフォルト値。[Int16](../data-types/int-uint.md)。

サポートされる引数：
- (U)Int8/16/32/64/128/256 の型の値または文字列表現。
- Float32/64型の値。

デフォルト値が返される引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt16OrDefault('0xc0fe', CAST('-1', 'Int16'));`。

:::note
入力値が [Int16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は16ビット整数値、そうでない場合は渡されたデフォルト値、または渡されなければ `0`。[Int16](../data-types/int-uint.md)。

:::note
- この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ：

``` sql
SELECT
    toInt16OrDefault('-16', CAST('-1', 'Int16')),
    toInt16OrDefault('abc', CAST('-1', 'Int16'))
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt16OrDefault('-16', CAST('-1', 'Int16')): -16
toInt16OrDefault('abc', CAST('-1', 'Int16')): -1
```

**参照**

- [`toInt16`](#toint16)。
- [`toInt16OrZero`](#toint16orzero)。
- [`toInt16OrNull`](#toint16ornull)。
## toInt32 {#toint32}

入力値を [`Int32`](../data-types/int-uint.md) 型の値に変換します。エラーの際には例外をスローします。

**構文**

```sql
toInt32(expr)
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions)。

サポートされる引数：
- (U)Int8/16/32/64/128/256型の値または文字列表現。
- Float32/64型の値。

サポートされない引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt32('0xc0fe');`。

:::note
入力値が [Int32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
例えば： `SELECT toInt32(2147483648) == -2147483648;`
:::

**返される値**

- 32ビット整数値。[Int32](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

```sql
SELECT
    toInt32(-32),
    toInt32(-32.32),
    toInt32('-32')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt32(-32):    -32
toInt32(-32.32): -32
toInt32('-32'):  -32
```

**参照**

- [`toInt32OrZero`](#toint32orzero)。
- [`toInt32OrNull`](#toint32ornull)。
- [`toInt32OrDefault`](#toint32ordefault)。
## toInt32OrZero {#toint32orzero}

[`toInt32`](#toint32) と同様に、この関数は入力値を [Int32](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `0` を返します。

**構文**

```sql
toInt32OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`0`を返す）：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt32OrZero('0xc0fe');`。

:::note
入力値が [Int32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 32ビット整数値が成功した場合、そうでない場合は `0`。[Int32](../data-types/int-uint.md) .

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt32OrZero('-32'),
    toInt32OrZero('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt32OrZero('-32'): -32
toInt32OrZero('abc'): 0
```
**参照**

- [`toInt32`](#toint32)。
- [`toInt32OrNull`](#toint32ornull)。
- [`toInt32OrDefault`](#toint32ordefault)。
## toInt32OrNull {#toint32ornull}

[`toInt32`](#toint32) と同様に、この関数は入力値を [Int32](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `NULL` を返します。

**構文**

```sql
toInt32OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256 型の文字列表現。

サポートされない引数（`\\N`を返す）
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt32OrNull('0xc0fe');`。

:::note
入力値が [Int32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は32ビット整数値、そうでない場合は `NULL`。[Int32](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt32OrNull('-32'),
    toInt32OrNull('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt32OrNull('-32'): -32
toInt32OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toInt32`](#toint32)。
- [`toInt32OrZero`](#toint32orzero)。
- [`toInt32OrDefault`](#toint32ordefault)。
## toInt32OrDefault {#toint32ordefault}

[`toInt32`](#toint32) と同様に、この関数は入力値を [Int32](../data-types/int-uint.md) 型の値に変換しますが、エラーの際にはデフォルト値を返します。
デフォルト値が渡されない場合は、エラーの際には `0` が返されます。

**構文**

```sql
toInt32OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` （オプション） — `Int32`型への解析が失敗した場合に返されるデフォルト値。[Int32](../data-types/int-uint.md)。

サポートされる引数：
- (U)Int8/16/32/64/128/256 の型の値または文字列表現。
- Float32/64型の値。

デフォルト値が返される引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt32OrDefault('0xc0fe', CAST('-1', 'Int32'));`。

:::note
入力値が [Int32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は32ビット整数値、そうでない場合は渡されたデフォルト値、または渡されなければ `0`。[Int32](../data-types/int-uint.md)。

:::note
- この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ：

``` sql
SELECT
    toInt32OrDefault('-32', CAST('-1', 'Int32')),
    toInt32OrDefault('abc', CAST('-1', 'Int32'))
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt32OrDefault('-32', CAST('-1', 'Int32')): -32
toInt32OrDefault('abc', CAST('-1', 'Int32')): -1
```

**参照**

- [`toInt32`](#toint32)。
- [`toInt32OrZero`](#toint32orzero)。
- [`toInt32OrNull`](#toint32ornull)。
## toInt64 {#toint64}

入力値を [`Int64`](../data-types/int-uint.md) 型の値に変換します。エラーの際には例外をスローします。

**構文**

```sql
toInt64(expr)
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions)。

サポートされる引数：
- (U)Int8/16/32/64/128/256型の値または文字列表現。
- Float32/64型の値。

サポートされない型：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt64('0xc0fe');`。

:::note
入力値が [Int64](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
例えば： `SELECT toInt64(9223372036854775808) == -9223372036854775808;`
:::

**返される値**

- 64ビット整数値。[Int64](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

```sql
SELECT
    toInt64(-64),
    toInt64(-64.64),
    toInt64('-64')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt64(-64):    -64
toInt64(-64.64): -64
toInt64('-64'):  -64
```

**参照**

- [`toInt64OrZero`](#toint64orzero)。
- [`toInt64OrNull`](#toint64ornull)。
- [`toInt64OrDefault`](#toint64ordefault)。
## toInt64OrZero {#toint64orzero}

[`toInt64`](#toint64) と同様に、この関数は入力値を [Int64](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `0` を返します。

**構文**

```sql
toInt64OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。[String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`0`を返す）：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt64OrZero('0xc0fe');`。

:::note
入力値が [Int64](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 64ビット整数値が成功した場合、そうでない場合は `0`。[Int64](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt64OrZero('-64'),
    toInt64OrZero('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt64OrZero('-64'): -64
toInt64OrZero('abc'): 0
```

**参照**

- [`toInt64`](#toint64)。
- [`toInt64OrNull`](#toint64ornull)。
- [`toInt64OrDefault`](#toint64ordefault)。
## toInt64OrNull {#toint64ornull}

[`toInt64`](#toint64) と同様に、この関数は入力値を [Int64](../data-types/int-uint.md) 型の値に変換しますが、エラーの際には `NULL` を返します。

**構文**

```sql
toInt64OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。[式](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。

サポートされる引数：
- (U)Int8/16/32/128/256型の文字列表現。

サポートされない引数（`\\N`を返す）
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt64OrNull('0xc0fe');`。

:::note
入力値が [Int64](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は64ビット整数値、そうでない場合は `NULL`。[Int64](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

``` sql
SELECT
    toInt64OrNull('-64'),
    toInt64OrNull('abc')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt64OrNull('-64'): -64
toInt64OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toInt64`](#toint64)。
- [`toInt64OrZero`](#toint64orzero)。
- [`toInt64OrDefault`](#toint64ordefault)。
## toInt64OrDefault {#toint64ordefault}

[`toInt64`](#toint64) と同様に、この関数は入力値を [Int64](../data-types/int-uint.md) 型の値に変換しますが、エラーの際にはデフォルト値を返します。
デフォルト値が渡されない場合は、エラーの際には `0` が返されます。

**構文**

```sql
toInt64OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` （オプション） — `Int64`型への解析が失敗した場合に返されるデフォルト値。[Int64](../data-types/int-uint.md)。

サポートされる引数：
- (U)Int8/16/32/64/128/256 の型の値または文字列表現。
- Float32/64型の値。

デフォルト値が返される引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt64OrDefault('0xc0fe', CAST('-1', 'Int64'));`。

:::note
入力値が [Int64](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は64ビット整数値、そうでない場合は渡されたデフォルト値、または渡されなければ `0`。[Int64](../data-types/int-uint.md)。

:::note
- この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ：

``` sql
SELECT
    toInt64OrDefault('-64', CAST('-1', 'Int64')),
    toInt64OrDefault('abc', CAST('-1', 'Int64'))
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt64OrDefault('-64', CAST('-1', 'Int64')): -64
toInt64OrDefault('abc', CAST('-1', 'Int64')): -1
```

**参照**

- [`toInt64`](#toint64)。
- [`toInt64OrZero`](#toint64orzero)。
- [`toInt64OrNull`](#toint64ornull)。
## toInt128 {#toint128}

入力値を [`Int128`](../data-types/int-uint.md) 型の値に変換します。エラーの際には例外をスローします。

**構文**

```sql
toInt128(expr)
```

**引数**

- `expr` — 数字または数字の文字列としての表現を返す式。[式](../syntax.md/#syntax-expressions)。

サポートされる引数：
- (U)Int8/16/32/64/128/256型の値または文字列表現。
- Float32/64型の値。

サポートされない引数：
- Float32/64型の値の文字列表現、包括して `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例： `SELECT toInt128('0xc0fe');`。

:::note
入力値が [Int128](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 128ビット整数値。[Int128](../data-types/int-uint.md)。

:::note
この関数は [zeroへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用し、小数点以下を切り捨てます。
:::

**例**

クエリ：

```sql
SELECT
    toInt128(-128),
    toInt128(-128.8),
    toInt128('-128')
FORMAT Vertical;
```

結果：

```response
Row 1:
──────
toInt128(-128):   -128
toInt128(-128.8): -128
toInt128('-128'): -128
```

**参照**

- [`toInt128OrZero`](#toint128orzero)。
- [`toInt128OrNull`](#toint128ornull)。
- [`toInt128OrDefault`](#toint128ordefault)。
## toInt128OrZero {#toint128orzero}

[`toInt128`](#toint128) と同様に、この関数は入力値を [Int128](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `0` を返します。

**構文**

```sql
toInt128OrZero(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`0` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt128OrZero('0xc0fe');`。

:::note
入力値が [Int128](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 128 ビットの整数値、そうでない場合は `0`。 [Int128](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toInt128OrZero('-128'),
    toInt128OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt128OrZero('-128'): -128
toInt128OrZero('abc'):  0
```

**関連情報**

- [`toInt128`](#toint128)。
- [`toInt128OrNull`](#toint128ornull)。
- [`toInt128OrDefault`](#toint128ordefault)。
## toInt128OrNull {#toint128ornull}

[`toInt128`](#toint128) と同様に、この関数は入力値を [Int128](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `NULL` を返します。

**構文**

```sql
toInt128OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`\N` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt128OrNull('0xc0fe');`。

:::note
入力値が [Int128](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 128 ビットの整数値、そうでない場合は `NULL`。 [Int128](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toInt128OrNull('-128'),
    toInt128OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt128OrNull('-128'): -128
toInt128OrNull('abc'):  ᴺᵁᴸᴸ
```

**関連情報**

- [`toInt128`](#toint128)。
- [`toInt128OrZero`](#toint128orzero)。
- [`toInt128OrDefault`](#toint128ordefault)。
## toInt128OrDefault {#toint128ordefault}

[`toInt128`](#toint128) と同様に、この関数は入力値を [Int128](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合はデフォルト値を返します。
`default` 値が渡されていない場合は `0` がエラー時に返されます。

**構文**

```sql
toInt128OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` (オプション) — `Int128` 型への解析が失敗した場合に返すデフォルト値。 [Int128](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 の値または文字列表現。
- Float32/64 の値。
- (U)Int8/16/32/128/256 の文字列表現。

デフォルト値が返される引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt128OrDefault('0xc0fe', CAST('-1', 'Int128'));`。

:::note
入力値が [Int128](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 128 ビットの整数値、そうでない場合は渡されたデフォルト値を返すか、渡されなかった場合は `0` を返します。 [Int128](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ:

``` sql
SELECT
    toInt128OrDefault('-128', CAST('-1', 'Int128')),
    toInt128OrDefault('abc', CAST('-1', 'Int128'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt128OrDefault('-128', CAST('-1', 'Int128')): -128
toInt128OrDefault('abc', CAST('-1', 'Int128')):  -1
```

**関連情報**

- [`toInt128`](#toint128)。
- [`toInt128OrZero`](#toint128orzero)。
- [`toInt128OrNull`](#toint128ornull)。
## toInt256 {#toint256}

入力値を[`Int256`](../data-types/int-uint.md) 型の値に変換します。エラーの場合は例外をスローします。

**構文**

```sql
toInt256(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt256('0xc0fe');`。

:::note
入力値が [Int256](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 256 ビットの整数値。 [Int256](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

```sql
SELECT
    toInt256(-256),
    toInt256(-256.256),
    toInt256('-256')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt256(-256):     -256
toInt256(-256.256): -256
toInt256('-256'):   -256
```

**関連情報**

- [`toInt256OrZero`](#toint256orzero)。
- [`toInt256OrNull`](#toint256ornull)。
- [`toInt256OrDefault`](#toint256ordefault)。
## toInt256OrZero {#toint256orzero}

[`toInt256`](#toint256) と同様に、この関数は入力値を [Int256](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `0` を返します。

**構文**

```sql
toInt256OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`0` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt256OrZero('0xc0fe');`。

:::note
入力値が [Int256](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 256 ビットの整数値、そうでない場合は `0`。 [Int256](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toInt256OrZero('-256'),
    toInt256OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt256OrZero('-256'): -256
toInt256OrZero('abc'):  0
```

**関連情報**

- [`toInt256`](#toint256)。
- [`toInt256OrNull`](#toint256ornull)。
- [`toInt256OrDefault`](#toint256ordefault)。
## toInt256OrNull {#toint256ornull}

[`toInt256`](#toint256) と同様に、この関数は入力値を [Int256](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `NULL` を返します。

**構文**

```sql
toInt256OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`\N` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt256OrNull('0xc0fe');`。

:::note
入力値が [Int256](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 256 ビットの整数値、そうでない場合は `NULL`。 [Int256](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toInt256OrNull('-256'),
    toInt256OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt256OrNull('-256'): -256
toInt256OrNull('abc'):  ᴺᵁᴸᴸ
```

**関連情報**

- [`toInt256`](#toint256)。
- [`toInt256OrZero`](#toint256orzero)。
- [`toInt256OrDefault`](#toint256ordefault)。
## toInt256OrDefault {#toint256ordefault}

[`toInt256`](#toint256) と同様に、この関数は入力値を [Int256](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合はデフォルト値を返します。
`default` 値が渡されていない場合は `0` がエラー時に返されます。

**構文**

```sql
toInt256OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` (オプション) — `Int256` 型への解析が失敗した場合に返すデフォルト値。 [Int256](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 の値または文字列表現。
- Float32/64 の値。

デフォルト値が返される引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toInt256OrDefault('0xc0fe', CAST('-1', 'Int256'));`。

:::note
入力値が [Int256](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 256 ビットの整数値、そうでない場合は渡されたデフォルト値を返すか、渡されなかった場合は `0` を返します。 [Int256](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ:

``` sql
SELECT
    toInt256OrDefault('-256', CAST('-1', 'Int256')),
    toInt256OrDefault('abc', CAST('-1', 'Int256'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toInt256OrDefault('-256', CAST('-1', 'Int256')): -256
toInt256OrDefault('abc', CAST('-1', 'Int256')):  -1
```

**関連情報**

- [`toInt256`](#toint256)。
- [`toInt256OrZero`](#toint256orzero)。
- [`toInt256OrNull`](#toint256ornull)。
## toUInt8 {#touint8}

入力値を [`UInt8`](../data-types/int-uint.md) 型の値に変換します。エラーの場合は例外をスローします。

**構文**

```sql
toUInt8(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt8('0xc0fe');`。

:::note
入力値が [UInt8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
たとえば: `SELECT toUInt8(256) == 0;`
:::

**返される値**

- 8 ビットの符号なし整数値。 [UInt8](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

```sql
SELECT
    toUInt8(8),
    toUInt8(8.8),
    toUInt8('8')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt8(8):   8
toUInt8(8.8): 8
toUInt8('8'): 8
```

**関連情報**

- [`toUInt8OrZero`](#touint8orzero)。
- [`toUInt8OrNull`](#touint8ornull)。
- [`toUInt8OrDefault`](#touint8ordefault)。
## toUInt8OrZero {#touint8orzero}

[`toUInt8`](#touint8) と同様に、この関数は入力値を [UInt8](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `0` を返します。

**構文**

```sql
toUInt8OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`0` を返す）:
- 通常の Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt8OrZero('0xc0fe');`。

:::note
入力値が [UInt8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 8 ビットの符号なし整数値、そうでない場合は `0`。 [UInt8](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt8OrZero('-8'),
    toUInt8OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt8OrZero('-8'):  0
toUInt8OrZero('abc'): 0
```

**関連情報**

- [`toUInt8`](#touint8)。
- [`toUInt8OrNull`](#touint8ornull)。
- [`toUInt8OrDefault`](#touint8ordefault)。
## toUInt8OrNull {#touint8ornull}

[`toUInt8`](#touint8) と同様に、この関数は入力値を [UInt8](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `NULL` を返します。

**構文**

```sql
toUInt8OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`\N` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt8OrNull('0xc0fe');`。

:::note
入力値が [UInt8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 8 ビットの符号なし整数値、そうでない場合は `NULL`。 [UInt8](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt8OrNull('8'),
    toUInt8OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt8OrNull('8'):   8
toUInt8OrNull('abc'): ᴺᵁᴸᴸ
```

**関連情報**

- [`toUInt8`](#touint8)。
- [`toUInt8OrZero`](#touint8orzero)。
- [`toUInt8OrDefault`](#touint8ordefault)。
## toUInt8OrDefault {#touint8ordefault}

[`toUInt8`](#touint8) と同様に、この関数は入力値を [UInt8](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合はデフォルト値を返します。
`default` 値が渡されていない場合は `0` がエラー時に返されます。

**構文**

```sql
toUInt8OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` (オプション) — `UInt8` 型への解析が失敗した場合に返すデフォルト値。 [UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 の値または文字列表現。
- Float32/64 の値。

デフォルト値が返される引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt8OrDefault('0xc0fe', CAST('0', 'UInt8'));`。

:::note
入力値が [UInt8](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 8 ビットの符号なし整数値、そうでない場合は渡されたデフォルト値を返すか、渡されなかった場合は `0` を返します。 [UInt8](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt8OrDefault('8', CAST('0', 'UInt8')),
    toUInt8OrDefault('abc', CAST('0', 'UInt8'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt8OrDefault('8', CAST('0', 'UInt8')):   8
toUInt8OrDefault('abc', CAST('0', 'UInt8')): 0
```

**関連情報**

- [`toUInt8`](#touint8)。
- [`toUInt8OrZero`](#touint8orzero)。
- [`toUInt8OrNull`](#touint8ornull)。
## toUInt16 {#touint16}

入力値を[`UInt16`](../data-types/int-uint.md) 型の値に変換します。エラーの場合は例外をスローします。

**構文**

```sql
toUInt16(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt16('0xc0fe');`。

:::note
入力値が [UInt16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
たとえば: `SELECT toUInt16(65536) == 0;`
:::

**返される値**

- 16 ビットの符号なし整数値。 [UInt16](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

```sql
SELECT
    toUInt16(16),
    toUInt16(16.16),
    toUInt16('16')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt16(16):    16
toUInt16(16.16): 16
toUInt16('16'):  16
```

**関連情報**

- [`toUInt16OrZero`](#touint16orzero)。
- [`toUInt16OrNull`](#touint16ornull)。
- [`toUInt16OrDefault`](#touint16ordefault)。
## toUInt16OrZero {#touint16orzero}

[`toUInt16`](#touint16) と同様に、この関数は入力値を [UInt16](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `0` を返します。

**構文**

```sql
toUInt16OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`0` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt16OrZero('0xc0fe');`。

:::note
入力値が [UInt16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 16 ビットの符号なし整数値、そうでない場合は `0`。 [UInt16](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt16OrZero('16'),
    toUInt16OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt16OrZero('16'):  16
toUInt16OrZero('abc'): 0
```

**関連情報**

- [`toUInt16`](#touint16)。
- [`toUInt16OrNull`](#touint16ornull)。
- [`toUInt16OrDefault`](#touint16ordefault)。
## toUInt16OrNull {#touint16ornull}

[`toUInt16`](#touint16) と同様に、この関数は入力値を [UInt16](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `NULL` を返します。

**構文**

```sql
toUInt16OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`\N` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt16OrNull('0xc0fe');`。

:::note
入力値が [UInt16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 16 ビットの符号なし整数値、そうでない場合は `NULL`。 [UInt16](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt16OrNull('16'),
    toUInt16OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt16OrNull('16'):  16
toUInt16OrNull('abc'): ᴺᵁᴸᴸ
```

**関連情報**

- [`toUInt16`](#touint16)。
- [`toUInt16OrZero`](#touint16orzero)。
- [`toUInt16OrDefault`](#touint16ordefault)。
## toUInt16OrDefault {#touint16ordefault}

[`toUInt16`](#touint16) と同様に、この関数は入力値を [UInt16](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合はデフォルト値を返します。
`default` 値が渡されていない場合は `0` がエラー時に返されます。

**構文**

```sql
toUInt16OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` (オプション) — `UInt16` 型への解析が失敗した場合に返すデフォルト値。 [UInt16](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 の値または文字列表現。
- Float32/64 の値。

デフォルト値が返される引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt16OrDefault('0xc0fe', CAST('0', 'UInt16'));`。

:::note
入力値が [UInt16](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 16 ビットの符号なし整数値、そうでない場合は渡されたデフォルト値を返すか、渡されなかった場合は `0` を返します。 [UInt16](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
- デフォルト値の型はキャスト型と同じであるべきです。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt16OrDefault('16', CAST('0', 'UInt16')),
    toUInt16OrDefault('abc', CAST('0', 'UInt16'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt16OrDefault('16', CAST('0', 'UInt16')):  16
toUInt16OrDefault('abc', CAST('0', 'UInt16')): 0
```

**関連情報**

- [`toUInt16`](#touint16)。
- [`toUInt16OrZero`](#touint16orzero)。
- [`toUInt16OrNull`](#touint16ornull)。
## toUInt32 {#touint32}

入力値を [`UInt32`](../data-types/int-uint.md) 型の値に変換します。エラーの場合は例外をスローします。

**構文**

```sql
toUInt32(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない引数:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt32('0xc0fe');`。

:::note
入力値が [UInt32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
たとえば: `SELECT toUInt32(4294967296) == 0;`
:::

**返される値**

- 32 ビットの符号なし整数値。 [UInt32](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

```sql
SELECT
    toUInt32(32),
    toUInt32(32.32),
    toUInt32('32')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt32(32):    32
toUInt32(32.32): 32
toUInt32('32'):  32
```

**関連情報**

- [`toUInt32OrZero`](#touint32orzero)。
- [`toUInt32OrNull`](#touint32ornull)。
- [`toUInt32OrDefault`](#touint32ordefault)。
## toUInt32OrZero {#touint32orzero}

[`toUInt32`](#touint32) と同様に、この関数は入力値を [UInt32](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `0` を返します。

**構文**

```sql
toUInt32OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`0` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt32OrZero('0xc0fe');`。

:::note
入力値が [UInt32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 32 ビットの符号なし整数値、そうでない場合は `0`。 [UInt32](../data-types/int-uint.md)

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt32OrZero('32'),
    toUInt32OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt32OrZero('32'):  32
toUInt32OrZero('abc'): 0
```

**関連情報**

- [`toUInt32`](#touint32)。
- [`toUInt32OrNull`](#touint32ornull)。
- [`toUInt32OrDefault`](#touint32ordefault)。
## toUInt32OrNull {#touint32ornull}

[`toUInt32`](#touint32) と同様に、この関数は入力値を [UInt32](../data-types/int-uint.md) 型の値に変換しますが、エラーの場合は `NULL` を返します。

**構文**

```sql
toUInt32OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [String](../data-types/string.md)。

サポートされている引数:
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数（`\N` を返す）:
- Float32/64 値の文字列表現、包括的に `NaN` と `Inf`。
- バイナリおよび16進数の値の文字列表現、例: `SELECT toUInt32OrNull('0xc0fe');`。

:::note
入力値が [UInt32](../data-types/int-uint.md) の範囲内に表現できない場合、結果がオーバーフローまたはアンダーフローします。
これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 32 ビットの符号なし整数値、そうでない場合は `NULL`。 [UInt32](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、数字の小数点以下の桁を切り捨てます。
:::

**例**

クエリ:

``` sql
SELECT
    toUInt32OrNull('32'),
    toUInt32OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt32OrNull('32'):  32
toUInt32OrNull('abc'): ᴺᵁᴸᴸ
```

**関連情報**

- [`toUInt32`](#touint32)。
- [`toUInt32OrZero`](#touint32orzero)。
- [`toUInt32OrDefault`](#touint32ordefault)。
## toUInt32OrDefault {#touint32ordefault}

[`toUInt32`](#touint32) と同様に、この関数は入力値を [UInt32](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合はデフォルト値を返します。デフォルト値が指定されない場合は、エラーが発生した際に `0` が返されます。

**構文**

```sql
toUInt32OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。
- `default` (オプション) — `UInt32` 型への解析が失敗した場合に返すデフォルト値。 [UInt32](../data-types/int-uint.md)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

デフォルト値が返される引数：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt32OrDefault('0xc0fe', CAST('0', 'UInt32'));`。

:::note
入力値が [UInt32](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 32 ビットの非符号整数値、そうでなければ指定されたデフォルト値を返すか、何も指定されていない場合は `0` を返します。 [UInt32](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
- デフォルト値の型はキャスト型と同じである必要があります。
:::

**例**

クエリ:

```sql
SELECT
    toUInt32OrDefault('32', CAST('0', 'UInt32')),
    toUInt32OrDefault('abc', CAST('0', 'UInt32'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt32OrDefault('32', CAST('0', 'UInt32')):  32
toUInt32OrDefault('abc', CAST('0', 'UInt32')): 0
```

**参照**

- [`toUInt32`](#touint32)。
- [`toUInt32OrZero`](#touint32orzero)。
- [`toUInt32OrNull`](#touint32ornull)。
## toUInt64 {#touint64}

入力値を [`UInt64`](../data-types/int-uint.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toUInt64(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない型：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt64('0xc0fe');`。

:::note
入力値が [UInt64](../data-types/int-uint.md) の範囲内で表現できない場合、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。例: `SELECT toUInt64(18446744073709551616) == 0;`
:::

**返される値**

- 64 ビットの非符号整数値。 [UInt64](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt64(64),
    toUInt64(64.64),
    toUInt64('64')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt64(64):    64
toUInt64(64.64): 64
toUInt64('64'):  64
```

**参照**

- [`toUInt64OrZero`](#touint64orzero)。
- [`toUInt64OrNull`](#touint64ornull)。
- [`toUInt64OrDefault`](#touint64ordefault)。
## toUInt64OrZero {#touint64orzero}

[`toUInt64`](#touint64) と同様に、この関数は入力値を [UInt64](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toUInt64OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数 (返されるのは `0`):
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt64OrZero('0xc0fe');`。

:::note
入力値が [UInt64](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 64 ビットの非符号整数値、そうでなければ `0`。 [UInt64](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt64OrZero('64'),
    toUInt64OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt64OrZero('64'):  64
toUInt64OrZero('abc'): 0
```

**参照**

- [`toUInt64`](#touint64)。
- [`toUInt64OrNull`](#touint64ornull)。
- [`toUInt64OrDefault`](#touint64ordefault)。
## toUInt64OrNull {#touint64ornull}

[`toUInt64`](#touint64) と同様に、この関数は入力値を [UInt64](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合は `NULL` を返します。

**構文**

```sql
toUInt64OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数 (返されるのは `\N`)
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt64OrNull('0xc0fe');`。

:::note
入力値が [UInt64](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 64 ビットの非符号整数値、そうでなければ `NULL`。 [UInt64](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt64OrNull('64'),
    toUInt64OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt64OrNull('64'):  64
toUInt64OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toUInt64`](#touint64)。
- [`toUInt64OrZero`](#touint64orzero)。
- [`toUInt64OrDefault`](#touint64ordefault)。
## toUInt64OrDefault {#touint64ordefault}

[`toUInt64`](#touint64) と同様に、この関数は入力値を [UInt64](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合はデフォルト値を返します。デフォルト値が指定されない場合は、エラーが発生した際に `0` が返されます。

**構文**

```sql
toUInt64OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。
- `default` (オプション) — `UInt64` 型への解析が失敗した場合に返すデフォルト値。 [UInt64](../data-types/int-uint.md)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

デフォルト値が返される引数：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt64OrDefault('0xc0fe', CAST('0', 'UInt64'));`。

:::note
入力値が [UInt64](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 64 ビットの非符号整数値、そうでなければ指定されたデフォルト値を返すか、何も指定されていない場合は `0` を返します。 [UInt64](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
- デフォルト値の型はキャスト型と同じである必要があります。
:::

**例**

クエリ:

```sql
SELECT
    toUInt64OrDefault('64', CAST('0', 'UInt64')),
    toUInt64OrDefault('abc', CAST('0', 'UInt64'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt64OrDefault('64', CAST('0', 'UInt64')):  64
toUInt64OrDefault('abc', CAST('0', 'UInt64')): 0
```

**参照**

- [`toUInt64`](#touint64)。
- [`toUInt64OrZero`](#touint64orzero)。
- [`toUInt64OrNull`](#touint64ornull)。
## toUInt128 {#touint128}

入力値を [`UInt128`](../data-types/int-uint.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toUInt128(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない引数：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt128('0xc0fe');`。

:::note
入力値が [UInt128](../data-types/int-uint.md) の範囲内で表現できない場合、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 128 ビットの非符号整数値。 [UInt128](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt128(128),
    toUInt128(128.8),
    toUInt128('128')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt128(128):   128
toUInt128(128.8): 128
toUInt128('128'): 128
```

**参照**

- [`toUInt128OrZero`](#touint128orzero)。
- [`toUInt128OrNull`](#touint128ornull)。
- [`toUInt128OrDefault`](#touint128ordefault)。
## toUInt128OrZero {#touint128orzero}

[`toUInt128`](#touint128) と同様に、この関数は入力値を [UInt128](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toUInt128OrZero(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数 (返されるのは `0`):
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt128OrZero('0xc0fe');`。

:::note
入力値が [UInt128](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 128 ビットの非符号整数値、そうでなければ `0`。 [UInt128](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt128OrZero('128'),
    toUInt128OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt128OrZero('128'): 128
toUInt128OrZero('abc'): 0
```

**参照**

- [`toUInt128`](#touint128)。
- [`toUInt128OrNull`](#touint128ornull)。
- [`toUInt128OrDefault`](#touint128ordefault)。
## toUInt128OrNull {#touint128ornull}

[`toUInt128`](#touint128) と同様に、この関数は入力値を [UInt128](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合は `NULL` を返します。

**構文**

```sql
toUInt128OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数 (返されるのは `\N`)
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt128OrNull('0xc0fe');`。

:::note
入力値が [UInt128](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 128 ビットの非符号整数値、そうでなければ `NULL`。 [UInt128](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt128OrNull('128'),
    toUInt128OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt128OrNull('128'): 128
toUInt128OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toUInt128`](#touint128)。
- [`toUInt128OrZero`](#touint128orzero)。
- [`toUInt128OrDefault`](#touint128ordefault)。
## toUInt128OrDefault {#touint128ordefault}

[`toUInt128`](#toint128) と同様に、この関数は入力値を [UInt128](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合はデフォルト値を返します。デフォルト値が指定されない場合は、エラーが発生した際に `0` が返されます。

**構文**

```sql
toUInt128OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。
- `default` (オプション) — `UInt128` 型への解析が失敗した場合に返すデフォルト値。 [UInt128](../data-types/int-uint.md)。

サポートされている引数：
- (U)Int8/16/32/64/128/256。
- Float32/64。
- (U)Int8/16/32/128/256 の文字列表現。

デフォルト値が返される引数：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt128OrDefault('0xc0fe', CAST('0', 'UInt128'));`。

:::note
入力値が [UInt128](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 128 ビットの非符号整数値、そうでなければ指定されたデフォルト値を返すか、何も指定されていない場合は `0` を返します。 [UInt128](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
- デフォルト値の型はキャスト型と同じである必要があります。
:::

**例**

クエリ:

```sql
SELECT
    toUInt128OrDefault('128', CAST('0', 'UInt128')),
    toUInt128OrDefault('abc', CAST('0', 'UInt128'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt128OrDefault('128', CAST('0', 'UInt128')): 128
toUInt128OrDefault('abc', CAST('0', 'UInt128')): 0
```

**参照**

- [`toUInt128`](#touint128)。
- [`toUInt128OrZero`](#touint128orzero)。
- [`toUInt128OrNull`](#touint128ornull)。
## toUInt256 {#touint256}

入力値を [`UInt256`](../data-types/int-uint.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toUInt256(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値または文字列表現。
- Float32/64 型の値。

サポートされていない引数：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt256('0xc0fe');`。

:::note
入力値が [UInt256](../data-types/int-uint.md) の範囲内で表現できない場合、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 256 ビットの非符号整数値。 [Int256](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt256(256),
    toUInt256(256.256),
    toUInt256('256')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt256(256):     256
toUInt256(256.256): 256
toUInt256('256'):   256
```

**参照**

- [`toUInt256OrZero`](#touint256orzero)。
- [`toUInt256OrNull`](#touint256ornull)。
- [`toUInt256OrDefault`](#touint256ordefault)。
## toUInt256OrZero {#touint256orzero}

[`toUInt256`](#touint256) と同様に、この関数は入力値を [UInt256](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toUInt256OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数 (返されるのは `0`):
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt256OrZero('0xc0fe');`。

:::note
入力値が [UInt256](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 256 ビットの非符号整数値、そうでなければ `0`。 [UInt256](../data-types/int-uint.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt256OrZero('256'),
    toUInt256OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt256OrZero('256'): 256
toUInt256OrZero('abc'): 0
```

**参照**

- [`toUInt256`](#touint256)。
- [`toUInt256OrNull`](#touint256ornull)。
- [`toUInt256OrDefault`](#touint256ordefault)。
## toUInt256OrNull {#touint256ornull}

[`toUInt256`](#touint256) と同様に、この関数は入力値を [UInt256](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合は `NULL` を返します。

**構文**

```sql
toUInt256OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256 の文字列表現。

サポートされていない引数 (返されるのは `\N`)
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt256OrNull('0xc0fe');`。

:::note
入力値が [UInt256](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 256 ビットの非符号整数値、そうでなければ `NULL`。 [UInt256](../data-types/int-uint.md) / [NULL](../data-types/nullable.md)。

:::note
この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
:::

**例**

クエリ:

```sql
SELECT
    toUInt256OrNull('256'),
    toUInt256OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt256OrNull('256'): 256
toUInt256OrNull('abc'): ᴺᵁᴸᴸ
```

**参照**

- [`toUInt256`](#touint256)。
- [`toUInt256OrZero`](#touint256orzero)。
- [`toUInt256OrDefault`](#touint256ordefault)。
## toUInt256OrDefault {#touint256ordefault}

[`toUInt256`](#touint256) と同様に、この関数は入力値を [UInt256](../data-types/int-uint.md) 型の値に変換しますが、エラーが発生した場合はデフォルト値を返します。デフォルト値が指定されない場合は、エラーが発生した際に `0` が返されます。

**構文**

```sql
toUInt256OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。
- `default` (オプション) — `UInt256` 型への解析が失敗した場合に返すデフォルト値。 [UInt256](../data-types/int-uint.md)。

サポートされている引数：
- (U)Int8/16/32/64/128/256。
- Float32/64。
- (U)Int8/16/32/256 の文字列表現。

デフォルト値が返される引数：
- `NaN` や `Inf` を含む Float32/64 値の文字列表現。
- バイナリおよび16進数値の文字列表現。例: `SELECT toUInt256OrDefault('0xc0fe', CAST('0', 'UInt256'));`。

:::note
入力値が [UInt256](../data-types/int-uint.md) の範囲内で表現できない場合は、結果がオーバーフローまたはアンダーフローします。これはエラーとは見なされません。
:::

**返される値**

- 成功した場合は 256 ビットの非符号整数値、そうでなければ指定されたデフォルト値を返すか、何も指定されていない場合は `0` を返します。 [UInt256](../data-types/int-uint.md)。

:::note
- この関数は [ゼロへの丸め](https://en.wikipedia.org/wiki/Rounding#Rounding_towards_zero) を使用しており、これは数値の小数部分を切り捨てることを意味します。
- デフォルト値の型はキャスト型と同じである必要があります。
:::

**例**

クエリ:

```sql
SELECT
    toUInt256OrDefault('-256', CAST('0', 'UInt256')),
    toUInt256OrDefault('abc', CAST('0', 'UInt256'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toUInt256OrDefault('-256', CAST('0', 'UInt256')): 0
toUInt256OrDefault('abc', CAST('0', 'UInt256')):  0
```

**参照**

- [`toUInt256`](#touint256)。
- [`toUInt256OrZero`](#touint256orzero)。
- [`toUInt256OrNull`](#touint256ornull)。
## toFloat32 {#tofloat32}

入力値を [`Float32`](../data-types/float.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toFloat32(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値。
- (U)Int8/16/32/128/256 の文字列表現。
- Float32/64 型の値、`NaN` および `Inf` を含む。
- Float32/64 の文字列表現、`NaN` および `Inf` を含む（大文字小文字を区別しない）。

サポートされていない引数：
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat32('0xc0fe');`。

**返される値**

- 32 ビットの浮動小数点値。 [Float32](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat32(42.7),
    toFloat32('42.7'),
    toFloat32('NaN')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat32(42.7):   42.7
toFloat32('42.7'): 42.7
toFloat32('NaN'):  nan
```

**参照**

- [`toFloat32OrZero`](#tofloat32orzero)。
- [`toFloat32OrNull`](#tofloat32ornull)。
- [`toFloat32OrDefault`](#tofloat32ordefault)。
## toFloat32OrZero {#tofloat32orzero}

[`toFloat32`](#tofloat32) と同様に、この関数は入力値を [Float32](../data-types/float.md) 型の値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toFloat32OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256、および Float32/64 の文字列表現。

サポートされていない引数 (返されるのは `0`):
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat32OrZero('0xc0fe');`。

**返される値**

- 成功した場合は 32 ビットの浮動小数点値、そうでなければ `0`。 [Float32](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat32OrZero('42.7'),
    toFloat32OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat32OrZero('42.7'): 42.7
toFloat32OrZero('abc'):  0
```

**参照**

- [`toFloat32`](#tofloat32)。
- [`toFloat32OrNull`](#tofloat32ornull)。
- [`toFloat32OrDefault`](#tofloat32ordefault)。
## toFloat32OrNull {#tofloat32ornull}

[`toFloat32`](#tofloat32) と同様に、この関数は入力値を [Float32](../data-types/float.md) 型の値に変換しますが、エラーが発生した場合は `NULL` を返します。

**構文**

```sql
toFloat32OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256、および Float32/64 の文字列表現。

サポートされていない引数 (返されるのは `\N`):
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat32OrNull('0xc0fe');`。

**返される値**

- 成功した場合は 32 ビットの浮動小数点値、そうでなければ `\N`。 [Float32](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat32OrNull('42.7'),
    toFloat32OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat32OrNull('42.7'): 42.7
toFloat32OrNull('abc'):  ᴺᵁᴸᴸ
```

**参照**

- [`toFloat32`](#tofloat32)。
- [`toFloat32OrZero`](#tofloat32orzero)。
- [`toFloat32OrDefault`](#tofloat32ordefault)。
## toFloat32OrDefault {#tofloat32ordefault}

[`toFloat32`](#tofloat32) と同様に、この関数は入力値を [Float32](../data-types/float.md) 型の値に変換しますが、エラーが発生した場合はデフォルト値を返します。デフォルト値が指定されない場合は、エラーが発生した際に `0` が返されます。

**構文**

```sql
toFloat32OrDefault(expr[, default])
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions) / [文字列](../data-types/string.md)。
- `default` (オプション) — `Float32` 型への解析が失敗した場合に返すデフォルト値。 [Float32](../data-types/float.md)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値。
- (U)Int8/16/32/128/256 の文字列表現。
- Float32/64 型の値 (`NaN` や `Inf` を含む)。
- Float32/64 の文字列表現 (`NaN` や `Inf` を含む、大文字小文字を区別しない)。

デフォルト値が返される引数：
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat32OrDefault('0xc0fe', CAST('0', 'Float32'));`。

**返される値**

- 成功した場合は 32 ビットの浮動小数点値、そうでなければ指定されたデフォルト値を返すか、何も指定されていない場合は `0` を返します。 [Float32](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat32OrDefault('8', CAST('0', 'Float32')),
    toFloat32OrDefault('abc', CAST('0', 'Float32'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat32OrDefault('8', CAST('0', 'Float32')):   8
toFloat32OrDefault('abc', CAST('0', 'Float32')): 0
```

**参照**

- [`toFloat32`](#tofloat32)。
- [`toFloat32OrZero`](#tofloat32orzero)。
- [`toFloat32OrNull`](#tofloat32ornull)。
## toFloat64 {#tofloat64}

入力値を [`Float64`](../data-types/float.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toFloat64(expr)
```

**引数**

- `expr` — 数字または数字の文字列表現を返す式。 [式](../syntax.md/#syntax-expressions)。

サポートされている引数：
- (U)Int8/16/32/64/128/256 型の値。
- (U)Int8/16/32/128/256 の文字列表現。
- Float32/64 型の値、`NaN` および `Inf` を含む。
- Float32/64 の文字列表現、`NaN` および `Inf` を含む（大文字小文字を区別しない）。

サポートされていない引数：
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat64('0xc0fe');`。

**返される値**

- 64 ビットの浮動小数点値。 [Float64](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat64(42.7),
    toFloat64('42.7'),
    toFloat64('NaN')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat64(42.7):   42.7
toFloat64('42.7'): 42.7
toFloat64('NaN'):  nan
```

**参照**

- [`toFloat64OrZero`](#tofloat64orzero)。
- [`toFloat64OrNull`](#tofloat64ornull)。
- [`toFloat64OrDefault`](#tofloat64ordefault)。
## toFloat64OrZero {#tofloat64orzero}

[`toFloat64`](#tofloat64) と同様に、この関数は入力値を [Float64](../data-types/float.md) 型の値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toFloat64OrZero(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256、および Float32/64 の文字列表現。

サポートされていない引数 (返されるのは `0`):
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat64OrZero('0xc0fe');`。

**返される値**

- 成功した場合は 64 ビットの浮動小数点値、そうでなければ `0`。 [Float64](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat64OrZero('42.7'),
    toFloat64OrZero('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat64OrZero('42.7'): 42.7
toFloat64OrZero('abc'):  0
```

**参照**

- [`toFloat64`](#tofloat64)。
- [`toFloat64OrNull`](#tofloat64ornull)。
- [`toFloat64OrDefault`](#tofloat64ordefault)。
## toFloat64OrNull {#tofloat64ornull}

[`toFloat64`](#tofloat64) と同様に、この関数は入力値を [Float64](../data-types/float.md) 型の値に変換しますが、エラーが発生した場合は `NULL` を返します。

**構文**

```sql
toFloat64OrNull(x)
```

**引数**

- `x` — 数字の文字列表現。 [文字列](../data-types/string.md)。

サポートされている引数：
- (U)Int8/16/32/128/256、および Float32/64 の文字列表現。

サポートされていない引数 (返されるのは `\N`):
- バイナリおよび16進数値の文字列表現。例: `SELECT toFloat64OrNull('0xc0fe');`。

**返される値**

- 成功した場合は 64 ビットの浮動小数点値、そうでなければ `\N`。 [Float64](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat64OrNull('42.7'),
    toFloat64OrNull('abc')
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat64OrNull('42.7'): 42.7
toFloat64OrNull('abc'):  ᴺᵁᴸᴸ
```

**参照**

- [`toFloat64`](#tofloat64)。
- [`toFloat64OrZero`](#tofloat64orzero)。
- [`toFloat64OrDefault`](#tofloat64ordefault)。

## toFloat64OrDefault {#tofloat64ordefault}

[`toFloat64`](#tofloat64)と同様に、この関数は入力値を[Float64](../data-types/float.md)型の値に変換しますが、エラーが発生した場合はデフォルト値を返します。
`default`値が指定されていない場合、エラー時には`0`が返されます。

**構文**

```sql
toFloat64OrDefault(expr[, default])
```

**引数**

- `expr` — 数値または数値の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions) / [String](../data-types/string.md)。
- `default` (オプション) — `Float64`型へのパースが失敗した場合に返すデフォルト値。 [Float64](../data-types/float.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256型の値。
- (U)Int8/16/32/128/256の文字列表現。
- `NaN`および`Inf`を含むFloat32/64型の値。
- `NaN`および`Inf`を含むFloat32/64の文字列表現（大文字小文字を区別しない）。

デフォルト値が返される引数:
- バイナリおよび16進数値の文字列表現、例: `SELECT toFloat64OrDefault('0xc0fe', CAST('0', 'Float64'));`。

**返される値**

- 成功した場合は64ビットのFloat値、成功しなかった場合は渡されたデフォルト値が返されるか、渡されていない場合は`0`が返されます。 [Float64](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT
    toFloat64OrDefault('8', CAST('0', 'Float64')),
    toFloat64OrDefault('abc', CAST('0', 'Float64'))
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
toFloat64OrDefault('8', CAST('0', 'Float64')):   8
toFloat64OrDefault('abc', CAST('0', 'Float64')): 0
```

**関連項目**

- [`toFloat64`](#tofloat64)。
- [`toFloat64OrZero`](#tofloat64orzero)。
- [`toFloat64OrNull`](#tofloat64ornull)。
## toBFloat16 {#tobfloat16}

入力値を[`BFloat16`](../data-types/float.md/#bfloat16)型の値に変換します。
エラーが発生した場合は例外をスローします。

**構文**

```sql
toBFloat16(expr)
```

**引数**

- `expr` — 数値または数値の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions)。

サポートされている引数:
- (U)Int8/16/32/64/128/256型の値。
- (U)Int8/16/32/128/256の文字列表現。
- `NaN`および`Inf`を含むFloat32/64型の値。
- `NaN`および`Inf`を含むFloat32/64の文字列表現（大文字小文字を区別しない）。

**返される値**

- 16ビットのbrain-float値。 [BFloat16](../data-types/float.md/#bfloat16)。

**例**

```sql
SELECT toBFloat16(toFloat32(42.7))

42.5

SELECT toBFloat16(toFloat32('42.7'));

42.5

SELECT toBFloat16('42.7');

42.5
```

**関連項目**

- [`toBFloat16OrZero`](#tobfloat16orzero)。
- [`toBFloat16OrNull`](#tobfloat16ornull)。
## toBFloat16OrZero {#tobfloat16orzero}

文字列の入力値を[`BFloat16`](../data-types/float.md/#bfloat16)型の値に変換します。
文字列が浮動小数点値を表さない場合、関数はゼロを返します。

**構文**

```sql
toBFloat16OrZero(x)
```

**引数**

- `x` — 数値の文字列表現。 [String](../data-types/string.md)。

サポートされている引数：

- 数値の文字列表現。

サポートされていない引数（`0`を返す）：

- バイナリおよび16進数値の文字列表現。
- 数値。

**返される値**

- 16ビットのbrain-float値、そうでなければ`0`。 [BFloat16](../data-types/float.md/#bfloat16)。

:::note
この関数は、文字列表現からの変換中に精度の静かな損失を許容します。
:::

**例**

```sql
SELECT toBFloat16OrZero('0x5E'); -- サポートされていない引数

0

SELECT toBFloat16OrZero('12.3'); -- 一般的な使用

12.25

SELECT toBFloat16OrZero('12.3456789');

12.3125 -- 静かな精度の損失
```

**関連項目**

- [`toBFloat16`](#tobfloat16)。
- [`toBFloat16OrNull`](#tobfloat16ornull)。
## toBFloat16OrNull {#tobfloat16ornull}

文字列の入力値を[`BFloat16`](../data-types/float.md/#bfloat16)型の値に変換しますが、文字列が浮動小数点値を表さない場合、関数は`NULL`を返します。

**構文**

```sql
toBFloat16OrNull(x)
```

**引数**

- `x` — 数値の文字列表現。 [String](../data-types/string.md)。

サポートされている引数：

- 数値の文字列表現。

サポートされていない引数（`NULL`を返す）：

- バイナリおよび16進数値の文字列表現。
- 数値。

**返される値**

- 16ビットのbrain-float値、そうでなければ`NULL` (`\N`)。 [BFloat16](../data-types/float.md/#bfloat16)。

:::note
この関数は、文字列表現からの変換中に精度の静かな損失を許容します。
:::

**例**

```sql
SELECT toBFloat16OrNull('0x5E'); -- サポートされていない引数

\N

SELECT toBFloat16OrNull('12.3'); -- 一般的な使用

12.25

SELECT toBFloat16OrNull('12.3456789');

12.3125 -- 静かな精度の損失
```

**関連項目**

- [`toBFloat16`](#tobfloat16)。
- [`toBFloat16OrZero`](#tobfloat16orzero)。
## toDate {#todate}

引数を[Date](../data-types/date.md)データ型に変換します。

引数が[DateTime](../data-types/datetime.md)または[DateTime64](../data-types/datetime64.md)の場合、それを切り捨ててDateTimeの日時部分を残します：

```sql
SELECT
    now() AS x,
    toDate(x)
```

```response
┌───────────────────x─┬─toDate(now())─┐
│ 2022-12-30 13:44:17 │    2022-12-30 │
└─────────────────────┴───────────────┘
```

引数が[String](../data-types/string.md)の場合、[Date](../data-types/date.md)または[DateTime](../data-types/datetime.md)として解析されます。[DateTime](../data-types/datetime.md)として解析された場合、日時部分が使用されます：

```sql
SELECT
    toDate('2022-12-30') AS x,
    toTypeName(x)
```

```response
┌──────────x─┬─toTypeName(toDate('2022-12-30'))─┐
│ 2022-12-30 │ Date                             │
└────────────┴──────────────────────────────────┘

1 row in set. Elapsed: 0.001 sec.
```

```sql
SELECT
    toDate('2022-12-30 01:02:03') AS x,
    toTypeName(x)
```

```response
┌──────────x─┬─toTypeName(toDate('2022-12-30 01:02:03'))─┐
│ 2022-12-30 │ Date                                      │
└────────────┴───────────────────────────────────────────┘
```

引数が数値で、UNIXタイムスタンプのように見える場合（65535より大きい）、それは[DateTime](../data-types/datetime.md)として解釈され、次に現在のタイムゾーンで[Date](../data-types/date.md)に切り捨てられます。タイムゾーン引数は関数の第2引数として指定できます。[Date](../data-types/date.md)への切り捨てはタイムゾーンによって異なります：

```sql
SELECT
    now() AS current_time,
    toUnixTimestamp(current_time) AS ts,
    toDateTime(ts) AS time_Amsterdam,
    toDateTime(ts, 'Pacific/Apia') AS time_Samoa,
    toDate(time_Amsterdam) AS date_Amsterdam,
    toDate(time_Samoa) AS date_Samoa,
    toDate(ts) AS date_Amsterdam_2,
    toDate(ts, 'Pacific/Apia') AS date_Samoa_2
```

```response
Row 1:
──────
current_time:     2022-12-30 13:51:54
ts:               1672404714
time_Amsterdam:   2022-12-30 13:51:54
time_Samoa:       2022-12-31 01:51:54
date_Amsterdam:   2022-12-30
date_Samoa:       2022-12-31
date_Amsterdam_2: 2022-12-30
date_Samoa_2:     2022-12-31
```

上記の例は、同じUNIXタイムスタンプが異なるタイムゾーンで異なる日付として解釈される方法を示しています。

引数が数値で、65536未満の場合、それは1970年1月1日以来の日数として解釈され、[Date](../data-types/date.md)に変換されます。これは`Date`データ型の内部的な数値表現に対応します。例：

```sql
SELECT toDate(12345)
```
```response
┌─toDate(12345)─┐
│    2003-10-20 │
└───────────────┘
```

この変換はタイムゾーンに依存しません。

引数がDate型の範囲に収まらない場合、実装に依存した動作が結果となり、最大サポート日付に達するかオーバーフローします：
```sql
SELECT toDate(10000000000.)
```
```response
┌─toDate(10000000000.)─┐
│           2106-02-07 │
└──────────────────────┘
```

`toDate`関数は代替形式でも書くことができ、以下のようになります：

```sql
SELECT
    now() AS time,
    toDate(time),
    DATE(time),
    CAST(time, 'Date')
```
```response
┌────────────────time─┬─toDate(now())─┬─DATE(now())─┬─CAST(now(), 'Date')─┐
│ 2022-12-30 13:54:58 │    2022-12-30 │  2022-12-30 │          2022-12-30 │
└─────────────────────┴───────────────┴─────────────┴─────────────────────┘
```
## toDateOrZero {#todateorzero}

[Date](#todate)と同様ですが、無効な引数を受け取った場合は[Date](../data-types/date.md)の下限を返します。サポートされている引数は[String](../data-types/string.md)のみです。

**例**

クエリ:

```sql
SELECT toDateOrZero('2022-12-30'), toDateOrZero('');
```

結果:

```response
┌─toDateOrZero('2022-12-30')─┬─toDateOrZero('')─┐
│                 2022-12-30 │       1970-01-01 │
└────────────────────────────┴──────────────────┘
```
## toDateOrNull {#todateornull}

[Date](#todate)と同様ですが、無効な引数を受け取った場合は`NULL`を返します。サポートされている引数は[String](../data-types/string.md)のみです。

**例**

クエリ:

```sql
SELECT toDateOrNull('2022-12-30'), toDateOrNull('');
```

結果:

```response
┌─toDateOrNull('2022-12-30')─┬─toDateOrNull('')─┐
│                 2022-12-30 │             ᴺᵁᴸᴸ │
└────────────────────────────┴──────────────────┘
```
## toDateOrDefault {#todateordefault}

[Date](#todate)と同様ですが、失敗した場合はデフォルト値を返します。それは、指定された第二引数（指定されている場合）か、そうでなければ[Date](../data-types/date.md)の下限です。

**構文**

```sql
toDateOrDefault(expr [, default_value])
```

**例**

クエリ:

```sql
SELECT toDateOrDefault('2022-12-30'), toDateOrDefault('', '2023-01-01'::Date);
```

結果:

```response
┌─toDateOrDefault('2022-12-30')─┬─toDateOrDefault('', CAST('2023-01-01', 'Date'))─┐
│                    2022-12-30 │                                      2023-01-01 │
└───────────────────────────────┴─────────────────────────────────────────────────┘
```
## toDateTime {#todatetime}

入力値を[DateTime](../data-types/datetime.md)に変換します。

**構文**

```sql
toDateTime(expr[, time_zone ])
```

**引数**

- `expr` — 値。 [String](../data-types/string.md)、[Int](../data-types/int-uint.md)、[Date](../data-types/date.md)または[DateTime](../data-types/datetime.md)。
- `time_zone` — タイムゾーン。 [String](../data-types/string.md)。

:::note
`expr`が数値の場合、それはUnix Epochの開始以来の秒数（Unixタイムスタンプ）として解釈されます。
`expr`が[String](../data-types/string.md)の場合、それはUnixタイムスタンプまたは日付/日時の文字列表現として解釈されることがあります。
したがって、短い数字の文字列表現（最大4桁）の解析はあいまいさのため明示的に無効化されています。例えば、文字列`'1999'`は年（Date / DateTimeの不完全な文字列表現）またはunixタイムスタンプの両方として解釈される可能性があります。より長い数値の文字列は許可されます。
:::

**返される値**

- 日付時刻。 [DateTime](../data-types/datetime.md)

**例**

クエリ:

```sql
SELECT toDateTime('2022-12-30 13:44:17'), toDateTime(1685457500, 'UTC');
```

結果:

```response
┌─toDateTime('2022-12-30 13:44:17')─┬─toDateTime(1685457500, 'UTC')─┐
│               2022-12-30 13:44:17 │           2023-05-30 14:38:20 │
└───────────────────────────────────┴───────────────────────────────┘
```
## toDateTimeOrZero {#todatetimeorzero}

[DateTime](#todatetime)と同様ですが、無効な引数を受け取った場合は[DateTime](../data-types/datetime.md)の下限を返します。サポートされている引数は[String](../data-types/string.md)のみです。

**例**

クエリ:

```sql
SELECT toDateTimeOrZero('2022-12-30 13:44:17'), toDateTimeOrZero('');
```

結果:

```response
┌─toDateTimeOrZero('2022-12-30 13:44:17')─┬─toDateTimeOrZero('')─┐
│                     2022-12-30 13:44:17 │  1970-01-01 00:00:00 │
└─────────────────────────────────────────┴──────────────────────┘
```
## toDateTimeOrNull {#todatetimeornull}

[DateTime](#todatetime)と同様ですが、無効な引数を受け取った場合は`NULL`を返します。サポートされている引数は[String](../data-types/string.md)のみです。

**例**

クエリ:

```sql
SELECT toDateTimeOrNull('2022-12-30 13:44:17'), toDateTimeOrNull('');
```

結果:

```response
┌─toDateTimeOrNull('2022-12-30 13:44:17')─┬─toDateTimeOrNull('')─┐
│                     2022-12-30 13:44:17 │                 ᴺᵁᴸᴸ │
└─────────────────────────────────────────┴──────────────────────┘
```
## toDateTimeOrDefault {#todatetimeordefault}

[DateTime](#todatetime)と同様ですが、失敗した場合はデフォルト値を返します。それは、指定された第三引数（指定されている場合）か、そうでなければ[DateTime](../data-types/datetime.md)の下限です。

**構文**

```sql
toDateTimeOrDefault(expr [, time_zone [, default_value]])
```

**例**

クエリ:

```sql
SELECT toDateTimeOrDefault('2022-12-30 13:44:17'), toDateTimeOrDefault('', 'UTC', '2023-01-01'::DateTime('UTC'));
```

結果:

```response
┌─toDateTimeOrDefault('2022-12-30 13:44:17')─┬─toDateTimeOrDefault('', 'UTC', CAST('2023-01-01', 'DateTime(\'UTC\')'))─┐
│                        2022-12-30 13:44:17 │                                                     2023-01-01 00:00:00 │
└────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────┘
```
## toDate32 {#todate32}

引数を[Date32](../data-types/date32.md)データ型に変換します。値が範囲外の場合、`toDate32`は[Date32](../data-types/date32.md)によってサポートされる境界値を返します。引数が[Date](../data-types/date.md)型の場合、その境界が考慮されます。

**構文**

```sql
toDate32(expr)
```

**引数**

- `expr` — 値。 [String](../data-types/string.md)、[UInt32](../data-types/int-uint.md)または[Date](../data-types/date.md)。

**返される値**

- カレンダー日付。型[Date32](../data-types/date32.md)。

**例**

1. 値が範囲内の場合:

```sql
SELECT toDate32('1955-01-01') AS value, toTypeName(value);
```

```response
┌──────value─┬─toTypeName(toDate32('1925-01-01'))─┐
│ 1955-01-01 │ Date32                             │
└────────────┴────────────────────────────────────┘
```

2. 値が範囲外の場合:

```sql
SELECT toDate32('1899-01-01') AS value, toTypeName(value);
```

```response
┌──────value─┬─toTypeName(toDate32('1899-01-01'))─┐
│ 1900-01-01 │ Date32                             │
└────────────┴────────────────────────────────────┘
```

3. [Date](../data-types/date.md)引数の場合:

```sql
SELECT toDate32(toDate('1899-01-01')) AS value, toTypeName(value);
```

```response
┌──────value─┬─toTypeName(toDate32(toDate('1899-01-01')))─┐
│ 1970-01-01 │ Date32                                     │
└────────────┴────────────────────────────────────────────┘
```
## toDate32OrZero {#todate32orzero}

[toDate32](#todate32)と同様ですが、無効な引数を受け取った場合は[Date32](../data-types/date32.md)の最小値を返します。

**例**

クエリ:

```sql
SELECT toDate32OrZero('1899-01-01'), toDate32OrZero('');
```

結果:

```response
┌─toDate32OrZero('1899-01-01')─┬─toDate32OrZero('')─┐
│                   1900-01-01 │         1900-01-01 │
└──────────────────────────────┴────────────────────┘
```
## toDate32OrNull {#todate32ornull}

[toDate32](#todate32)と同様ですが、無効な引数を受け取った場合は`NULL`を返します。

**例**

クエリ:

```sql
SELECT toDate32OrNull('1955-01-01'), toDate32OrNull('');
```

結果:

```response
┌─toDate32OrNull('1955-01-01')─┬─toDate32OrNull('')─┐
│                   1955-01-01 │               ᴺᵁᴸᴸ │
└──────────────────────────────┴────────────────────┘
```
## toDate32OrDefault {#todate32ordefault}

引数を[Date32](../data-types/date32.md)データ型に変換します。値が範囲外の場合、`toDate32OrDefault`は[Date32](../data-types/date32.md)によってサポートされる下限値を返します。引数が[Date](../data-types/date.md)型の場合、その境界が考慮されます。無効な引数を受け取った場合はデフォルト値を返します。

**例**

クエリ:

```sql
SELECT
    toDate32OrDefault('1930-01-01', toDate32('2020-01-01')),
    toDate32OrDefault('xx1930-01-01', toDate32('2020-01-01'));
```

結果:

```response
┌─toDate32OrDefault('1930-01-01', toDate32('2020-01-01'))─┬─toDate32OrDefault('xx1930-01-01', toDate32('2020-01-01'))─┐
│                                              1930-01-01 │                                                2020-01-01 │
└─────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────┘
```
## toDateTime64 {#todatetime64}

入力値を[DateTime64](../data-types/datetime64.md)型の値に変換します。

**構文**

```sql
toDateTime64(expr, scale, [timezone])
```

**引数**

- `expr` — 値。 [String](../data-types/string.md)、[UInt32](../data-types/int-uint.md)、[Float](../data-types/float.md)または[DateTime](../data-types/datetime.md)。
- `scale` - タイムックサイズ（精度）：10<sup>-precision</sup>秒。 有効範囲：[0 : 9]。
- `timezone` (オプション) - 指定されたdatetime64オブジェクトのタイムゾーン。

**返される値**

- サブ秒精度を持つカレンダー日付と時刻。 [DateTime64](../data-types/datetime64.md)。

**例**

1. 値が範囲内の場合:

```sql
SELECT toDateTime64('1955-01-01 00:00:00.000', 3) AS value, toTypeName(value);
```

```response
┌───────────────────value─┬─toTypeName(toDateTime64('1955-01-01 00:00:00.000', 3))─┐
│ 1955-01-01 00:00:00.000 │ DateTime64(3)                                          │
└─────────────────────────┴────────────────────────────────────────────────────────┘
```

2. 精度で小数として:

```sql
SELECT toDateTime64(1546300800.000, 3) AS value, toTypeName(value);
```

```response
┌───────────────────value─┬─toTypeName(toDateTime64(1546300800., 3))─┐
│ 2019-01-01 00:00:00.000 │ DateTime64(3)                            │
└─────────────────────────┴──────────────────────────────────────────┘
```

小数点なしでは値は依然として秒のUnixタイムスタンプとして扱われます：

```sql
SELECT toDateTime64(1546300800000, 3) AS value, toTypeName(value);
```

```response
┌───────────────────value─┬─toTypeName(toDateTime64(1546300800000, 3))─┐
│ 2282-12-31 00:00:00.000 │ DateTime64(3)                              │
└─────────────────────────┴────────────────────────────────────────────┘
```

3. `timezone`使用の場合:

```sql
SELECT toDateTime64('2019-01-01 00:00:00', 3, 'Asia/Istanbul') AS value, toTypeName(value);
```

```response
┌───────────────────value─┬─toTypeName(toDateTime64('2019-01-01 00:00:00', 3, 'Asia/Istanbul'))─┐
│ 2019-01-01 00:00:00.000 │ DateTime64(3, 'Asia/Istanbul')                                      │
└─────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```
## toDateTime64OrZero {#todatetime64orzero}

[getDateTime64](#todatetime64)と同様ですが、無効な引数を受け取った場合は[DateTime64](../data-types/datetime64.md)の最小値を返します。

**構文**

```sql
toDateTime64OrZero(expr, scale, [timezone])
```

**引数**

- `expr` — 値。 [String](../data-types/string.md)、[UInt32](../data-types/int-uint.md)、[Float](../data-types/float.md)または[DateTime](../data-types/datetime.md)。
- `scale` - タイムックサイズ（精度）：10<sup>-precision</sup>秒。 有効範囲：[0 : 9]。
- `timezone` (オプション) - 指定されたDateTime64オブジェクトのタイムゾーン。

**返される値**

- サブ秒精度を持つカレンダー日付と時刻、そうでなければ`DateTime64`の最小値：`1970-01-01 01:00:00.000`。 [DateTime64](../data-types/datetime64.md)。

**例**

クエリ:

```sql
SELECT toDateTime64OrZero('2008-10-12 00:00:00 00:30:30', 3) AS invalid_arg
```

結果:

```response
┌─────────────invalid_arg─┐
│ 1970-01-01 01:00:00.000 │
└─────────────────────────┘
```

**関連項目**

- [toDateTime64](#todatetime64)。
- [toDateTime64OrNull](#todatetime64ornull)。
- [toDateTime64OrDefault](#todatetime64ordefault)。
## toDateTime64OrNull {#todatetime64ornull}

[toDateTime64](#todatetime64)と同様ですが、無効な引数を受け取った場合は`NULL`を返します。

**構文**

```sql
toDateTime64OrNull(expr, scale, [timezone])
```

**引数**

- `expr` — 値。 [String](../data-types/string.md)、[UInt32](../data-types/int-uint.md)、[Float](../data-types/float.md)または[DateTime](../data-types/datetime.md)。
- `scale` - タイムックサイズ（精度）：10<sup>-precision</sup>秒。 有効範囲：[0 : 9]。
- `timezone` (オプション) - 指定されたDateTime64オブジェクトのタイムゾーン。

**返される値**

- サブ秒精度を持つカレンダー日付と時刻、そうでなければ`NULL`。 [DateTime64](../data-types/datetime64.md)/[NULL](../data-types/nullable.md)。

**例**

クエリ:

```sql
SELECT
    toDateTime64OrNull('1976-10-18 00:00:00.30', 3) AS valid_arg,
    toDateTime64OrNull('1976-10-18 00:00:00 30', 3) AS invalid_arg
```

結果:

```response
┌───────────────valid_arg─┬─invalid_arg─┐
│ 1976-10-18 00:00:00.300 │        ᴺᵁᴸᴸ │
└─────────────────────────┴─────────────┘
```

**関連項目**

- [toDateTime64](#todatetime64)。
- [toDateTime64OrZero](#todatetime64orzero)。
- [toDateTime64OrDefault](#todatetime64ordefault)。
## toDateTime64OrDefault {#todatetime64ordefault}

[toDateTime64](#todatetime64)と同様ですが、無効な引数を受け取った場合は[DateTime64](../data-types/datetime64.md)のデフォルト値または提供されたデフォルトを返します。

**構文**

```sql
toDateTime64OrNull(expr, scale, [timezone, default])
```

**引数**

- `expr` — 値。 [String](../data-types/string.md)、[UInt32](../data-types/int-uint.md)、[Float](../data-types/float.md)または[DateTime](../data-types/datetime.md)。
- `scale` - タイムックサイズ（精度）：10<sup>-precision</sup>秒。 有効範囲：[0 : 9]。
- `timezone` (オプション) - 指定されたDateTime64オブジェクトのタイムゾーン。
- `default` (オプション) - 無効な引数を受け取った場合に返すデフォルト値。 [DateTime64](../data-types/datetime64.md)。

**返される値**

- サブ秒精度を持つカレンダー日付と時刻、そうでなければ`DateTime64`の最小値または提供された`default`値。 [DateTime64](../data-types/datetime64.md)。

**例**

クエリ:

```sql
SELECT
    toDateTime64OrDefault('1976-10-18 00:00:00 30', 3) AS invalid_arg,
    toDateTime64OrDefault('1976-10-18 00:00:00 30', 3, 'UTC', toDateTime64('2001-01-01 00:00:00.00',3)) AS invalid_arg_with_default
```

結果:

```response
┌─────────────invalid_arg─┬─invalid_arg_with_default─┐
│ 1970-01-01 01:00:00.000 │  2000-12-31 23:00:00.000 │
└─────────────────────────┴──────────────────────────┘
```

**関連項目**

- [toDateTime64](#todatetime64)。
- [toDateTime64OrZero](#todatetime64orzero)。
- [toDateTime64OrNull](#todatetime64ornull)。
## toDecimal32 {#todecimal32}

入力値を[`Decimal(9, S)`](../data-types/decimal.md)型の値に変換します。スケール`S`を持ちます。エラーが発生した場合は例外をスローします。

**構文**

```sql
toDecimal32(expr, S)
```

**引数**

- `expr` — 数値または数値の文字列表現を返す式。 [Expression](../syntax.md/#syntax-expressions)。
- `S` — 小数部分の数桁を指定するスケールパラメータ（0〜9の間）。 [UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256型の値または文字列表現。
- Float32/64型の値または文字列表現。

サポートされていない引数:
- Float32/64型の値の`NaN`および`Inf`の文字列表現（大文字小文字を区別しない）。
- バイナリおよび16進数値の文字列表現、例: `SELECT toDecimal32('0xc0fe', 1);`。

:::note
`expr`の値が`Decimal32`の範囲を超えるとオーバーフローが発生する可能性があります：`( -1 * 10^(9 - S), 1 * 10^(9 - S) )`。
小数部における過剰桁は捨てられ（四捨五入されない）、整数部の過剰桁は例外を引き起こします。
:::

:::warning
変換では余分な桁が落ち、Float32/Float64の入力で動作が予期しない方法で行われる可能性があります。演算は浮動小数点命令を使用して行われるためです。
たとえば：`toDecimal32(1.15, 2)`は`1.14`と同じです。なぜなら、1.15 * 100は浮動小数点で114.99になるからです。
文字列入力を使用することで、演算が基になる整数型を使用するようにできます。例：`toDecimal32('1.15', 2) = 1.15`
:::

**返される値**

- `Decimal(9, S)`型の値。 [Decimal32(S)](../data-types/int-uint.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal32(2, 1) AS a, toTypeName(a) AS type_a,
    toDecimal32(4.2, 2) AS b, toTypeName(b) AS type_b,
    toDecimal32('4.2', 3) AS c, toTypeName(c) AS type_c
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:      2
type_a: Decimal(9, 1)
b:      4.2
type_b: Decimal(9, 2)
c:      4.2
type_c: Decimal(9, 3)
```

**関連項目**

- [`toDecimal32OrZero`](#todecimal32orzero)。
- [`toDecimal32OrNull`](#todecimal32ornull)。
- [`toDecimal32OrDefault`](#todecimal32ordefault)。
## toDecimal32OrZero {#todecimal32orzero}

[`toDecimal32`](#todecimal32)と同様に、この関数は入力値を[Decimal(9, S)](../data-types/decimal.md)型の値に変換しますが、エラーの場合は`0`を返します。

**構文**

```sql
toDecimal32OrZero(expr, S)
```

**引数**

- `expr` — 数値の文字列表現。 [String](../data-types/string.md)。
- `S` — 小数部分の数桁を指定するスケールパラメータ（0〜9の間）。 [UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256型の文字列表現。
- Float32/64型の文字列表現。

サポートされていない引数:
- Float32/64型の値の`NaN`および`Inf`の文字列表現。
- バイナリおよび16進数値の文字列表現、例: `SELECT toDecimal32OrZero('0xc0fe', 1);`。

:::note
オーバーフローが発生する可能性があります。`expr`の値が`Decimal32`の範囲を超えると、`( -1 * 10^(9 - S), 1 * 10^(9 - S) )`。
小数部の過剰は捨てられ（四捨五入されない）、整数部の過剰はエラーを引き起こします。
:::

**返される値**

- 成功した場合は`Decimal(9, S)`型の値、そうでない場合は`0`が返され、`S`小数桁を持ちます。 [Decimal32(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal32OrZero(toString(-1.111), 5) AS a,
    toTypeName(a),
    toDecimal32OrZero(toString('Inf'), 5) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             -1.111
toTypeName(a): Decimal(9, 5)
b:             0
toTypeName(b): Decimal(9, 5)
```

**関連項目**

- [`toDecimal32`](#todecimal32)。
- [`toDecimal32OrNull`](#todecimal32ornull)。
- [`toDecimal32OrDefault`](#todecimal32ordefault)。
## toDecimal32OrNull {#todecimal32ornull}

[`toDecimal32`](#todecimal32)と同様に、この関数は入力値を[Nullable(Decimal(9, S))](../data-types/decimal.md)型の値に変換しますが、エラーの場合は`0`を返します。

**構文**

```sql
toDecimal32OrNull(expr, S)
```

**引数**

- `expr` — 数値の文字列表現。 [String](../data-types/string.md)。
- `S` — 小数部分の数桁を指定するスケールパラメータ（0〜9の間）。 [UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256型の文字列表現。
- Float32/64型の文字列表現。

サポートされていない引数:
- Float32/64型の値の`NaN`および`Inf`の文字列表現。
- バイナリおよび16進数値の文字列表現、例: `SELECT toDecimal32OrNull('0xc0fe', 1);`。

:::note
オーバーフローが発生する可能性があります。`expr`の値が`Decimal32`の範囲を超えると、`( -1 * 10^(9 - S), 1 * 10^(9 - S) )`。
小数部の過剰は捨てられ（四捨五入されない）、整数部の過剰はエラーを引き起こします。
:::

**返される値**

- 成功した場合は`Nullable(Decimal(9, S))`型の値、そうでない場合は`NULL`の値が返されます。[Decimal32(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal32OrNull(toString(-1.111), 5) AS a,
    toTypeName(a),
    toDecimal32OrNull(toString('Inf'), 5) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             -1.111
toTypeName(a): Nullable(Decimal(9, 5))
b:             ᴺᵁᴸᴸ
toTypeName(b): Nullable(Decimal(9, 5))
```

**関連項目**

- [`toDecimal32`](#todecimal32)。
- [`toDecimal32OrZero`](#todecimal32orzero)。
- [`toDecimal32OrDefault`](#todecimal32ordefault)。
```
## toDecimal32OrDefault {#todecimal32ordefault}

[`toDecimal32`](#todecimal32) と同様に、この関数は入力値を [Decimal(9, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合はデフォルト値を返します。

**構文**

```sql
toDecimal32OrDefault(expr, S[, default])
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から9までのスケールパラメータ。 [UInt8](../data-types/int-uint.md)。
- `default` (オプション) — `Decimal32(S)` 型へのパースに失敗した場合に返すデフォルト値。 [Decimal32(S)](../data-types/decimal.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal32OrDefault('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal32` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(9 - S), 1 * 10^(9 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する可能性があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal32OrDefault(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal32OrDefault('1.15', 2) = 1.15`
:::

**返される値**

- 成功した場合は `Decimal(9, S)` 型の値。それ以外の場合は渡されたデフォルト値、または渡されなかった場合は `0` を返します。 [Decimal32(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal32OrDefault(toString(0.0001), 5) AS a,
    toTypeName(a),
    toDecimal32OrDefault('Inf', 0, CAST('-1', 'Decimal32(0)')) AS b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.0001
toTypeName(a): Decimal(9, 5)
b:             -1
toTypeName(b): Decimal(9, 0)
```

**参照**

- [`toDecimal32`](#todecimal32).
- [`toDecimal32OrZero`](#todecimal32orzero).
- [`toDecimal32OrNull`](#todecimal32ornull).
## toDecimal64 {#todecimal64}

入力値をスケール `S` の [`Decimal(18, S)`](../data-types/decimal.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toDecimal64(expr, S)
```

**引数**

- `expr` — 数を返す式または数の文字列表現。[Expression](../syntax.md/#syntax-expressions)。
- `S` — 数の小数部に持つことができる桁数を指定する0から18までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの値または文字列表現。
- Float32/64 タイプの値または文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の値または文字列表現（大文字小文字を区別しません）。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal64('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal64` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(18 - S), 1 * 10^(18 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合は例外が発生します。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する場合があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal64(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal64('1.15', 2) = 1.15`
:::

**返される値**

- `Decimal(18, S)` 型の値。[Decimal64(S)](../data-types/int-uint.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal64(2, 1) AS a, toTypeName(a) AS type_a,
    toDecimal64(4.2, 2) AS b, toTypeName(b) AS type_b,
    toDecimal64('4.2', 3) AS c, toTypeName(c) AS type_c
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:      2
type_a: Decimal(18, 1)
b:      4.2
type_b: Decimal(18, 2)
c:      4.2
type_c: Decimal(18, 3)
```

**参照**

- [`toDecimal64OrZero`](#todecimal64orzero).
- [`toDecimal64OrNull`](#todecimal64ornull).
- [`toDecimal64OrDefault`](#todecimal64ordefault).
## toDecimal64OrZero {#todecimal64orzero}

[`toDecimal64`](#todecimal64) と同様に、この関数は入力値を [Decimal(18, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toDecimal64OrZero(expr, S)
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から18までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal64OrZero('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal64` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(18 - S), 1 * 10^(18 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

**返される値**

- 成功した場合は `Decimal(18, S)` 型の値。それ以外の場合は `0` として `S` 桁の小数を返します。 [Decimal64(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal64OrZero(toString(0.0001), 18) AS a,
    toTypeName(a),
    toDecimal64OrZero(toString('Inf'), 18) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.0001
toTypeName(a): Decimal(18, 18)
b:             0
toTypeName(b): Decimal(18, 18)
```

**参照**

- [`toDecimal64`](#todecimal64).
- [`toDecimal64OrNull`](#todecimal64ornull).
- [`toDecimal64OrDefault`](#todecimal64ordefault).
## toDecimal64OrNull {#todecimal64ornull}

[`toDecimal64`](#todecimal64) と同様に、この関数は入力値を [Nullable(Decimal(18, S))](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toDecimal64OrNull(expr, S)
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から18までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal64OrNull('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal64` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(18 - S), 1 * 10^(18 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

**返される値**

- 成功した場合は `Nullable(Decimal(18, S))` 型の値。それ以外の場合は同じ型の値 `NULL` を返します。 [Decimal64(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal64OrNull(toString(0.0001), 18) AS a,
    toTypeName(a),
    toDecimal64OrNull(toString('Inf'), 18) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.0001
toTypeName(a): Nullable(Decimal(18, 18))
b:             ᴺᵁᴸᴸ
toTypeName(b): Nullable(Decimal(18, 18))
```

**参照**

- [`toDecimal64`](#todecimal64).
- [`toDecimal64OrZero`](#todecimal64orzero).
- [`toDecimal64OrDefault`](#todecimal64ordefault).
## toDecimal64OrDefault {#todecimal64ordefault}

[`toDecimal64`](#todecimal64) と同様に、この関数は入力値を [Decimal(18, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合はデフォルト値を返します。

**構文**

```sql
toDecimal64OrDefault(expr, S[, default])
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から18までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。
- `default` (オプション) — `Decimal64(S)` 型へのパースに失敗した場合に返すデフォルト値。 [Decimal64(S)](../data-types/decimal.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal64OrDefault('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal64` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(18 - S), 1 * 10^(18 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する可能性があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal64OrDefault(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal64OrDefault('1.15', 2) = 1.15`
:::

**返される値**

- 成功した場合は `Decimal(18, S)` 型の値。それ以外の場合は渡されたデフォルト値、または渡されなかった場合は `0` を返します。 [Decimal64(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal64OrDefault(toString(0.0001), 18) AS a,
    toTypeName(a),
    toDecimal64OrDefault('Inf', 0, CAST('-1', 'Decimal64(0)')) AS b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.0001
toTypeName(a): Decimal(18, 18)
b:             -1
toTypeName(b): Decimal(18, 0)
```

**参照**

- [`toDecimal64`](#todecimal64).
- [`toDecimal64OrZero`](#todecimal64orzero).
- [`toDecimal64OrNull`](#todecimal64ornull).
## toDecimal128 {#todecimal128}

入力値をスケール `S` の [`Decimal(38, S)`](../data-types/decimal.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toDecimal128(expr, S)
```

**引数**

- `expr` — 数を返す式または数の文字列表現。[Expression](../syntax.md/#syntax-expressions)。
- `S` — 数の小数部に持つことができる桁数を指定する0から38までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの値または文字列表現。
- Float32/64 タイプの値または文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の値または文字列表現（大文字小文字を区別しません）。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal128('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal128` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(38 - S), 1 * 10^(38 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合は例外が発生します。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する可能性があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal128(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal128('1.15', 2) = 1.15`
:::

**返される値**

- `Decimal(38, S)` 型の値。[Decimal128(S)](../data-types/int-uint.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal128(99, 1) AS a, toTypeName(a) AS type_a,
    toDecimal128(99.67, 2) AS b, toTypeName(b) AS type_b,
    toDecimal128('99.67', 3) AS c, toTypeName(c) AS type_c
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:      99
type_a: Decimal(38, 1)
b:      99.67
type_b: Decimal(38, 2)
c:      99.67
type_c: Decimal(38, 3)
```

**参照**

- [`toDecimal128OrZero`](#todecimal128orzero).
- [`toDecimal128OrNull`](#todecimal128ornull).
- [`toDecimal128OrDefault`](#todecimal128ordefault).
## toDecimal128OrZero {#todecimal128orzero}

[`toDecimal128`](#todecimal128) と同様に、この関数は入力値を [Decimal(38, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toDecimal128OrZero(expr, S)
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から38までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal128OrZero('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal128` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(38 - S), 1 * 10^(38 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

**返される値**

- 成功した場合は `Decimal(38, S)` 型の値。それ以外の場合は `0` として `S` 桁の小数を返します。 [Decimal128(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal128OrZero(toString(0.0001), 38) AS a,
    toTypeName(a),
    toDecimal128OrZero(toString('Inf'), 38) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.0001
toTypeName(a): Decimal(38, 38)
b:             0
toTypeName(b): Decimal(38, 38)
```

**参照**

- [`toDecimal128`](#todecimal128).
- [`toDecimal128OrNull`](#todecimal128ornull).
- [`toDecimal128OrDefault`](#todecimal128ordefault).
## toDecimal128OrNull {#todecimal128ornull}

[`toDecimal128`](#todecimal128) と同様に、この関数は入力値を [Nullable(Decimal(38, S))](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toDecimal128OrNull(expr, S)
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から38までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal128OrNull('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal128` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(38 - S), 1 * 10^(38 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

**返される値**

- 成功した場合は `Nullable(Decimal(38, S))` 型の値。それ以外の場合は同じ型の値 `NULL` を返します。 [Decimal128(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal128OrNull(toString(1/42), 38) AS a,
    toTypeName(a),
    toDecimal128OrNull(toString('Inf'), 38) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.023809523809523808
toTypeName(a): Nullable(Decimal(38, 38))
b:             ᴺᵁᴸᴸ
toTypeName(b): Nullable(Decimal(38, 38))
```

**参照**

- [`toDecimal128`](#todecimal128).
- [`toDecimal128OrZero`](#todecimal128orzero).
- [`toDecimal128OrDefault`](#todecimal128ordefault).
## toDecimal128OrDefault {#todecimal128ordefault}

[`toDecimal128`](#todecimal128) と同様に、この関数は入力値を [Decimal(38, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合はデフォルト値を返します。

**構文**

```sql
toDecimal128OrDefault(expr, S[, default])
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から38までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。
- `default` (オプション) — `Decimal128(S)` 型へのパースに失敗した場合に返すデフォルト値。 [Decimal128(S)](../data-types/decimal.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal128OrDefault('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal128` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(38 - S), 1 * 10^(38 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する可能性があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal128OrDefault(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal128OrDefault('1.15', 2) = 1.15`
:::

**返される値**

- 成功した場合は `Decimal(38, S)` 型の値。それ以外の場合は渡されたデフォルト値、または渡されなかった場合は `0` を返します。 [Decimal128(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal128OrDefault(toString(1/42), 18) AS a,
    toTypeName(a),
    toDecimal128OrDefault('Inf', 0, CAST('-1', 'Decimal128(0)')) AS b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.023809523809523808
toTypeName(a): Decimal(38, 18)
b:             -1
toTypeName(b): Decimal(38, 0)
```

**参照**

- [`toDecimal128`](#todecimal128).
- [`toDecimal128OrZero`](#todecimal128orzero).
- [`toDecimal128OrNull`](#todecimal128ornull).
## toDecimal256 {#todecimal256}

入力値をスケール `S` の [`Decimal(76, S)`](../data-types/decimal.md) 型の値に変換します。エラーが発生した場合は例外をスローします。

**構文**

```sql
toDecimal256(expr, S)
```

**引数**

- `expr` — 数を返す式または数の文字列表現。[Expression](../syntax.md/#syntax-expressions)。
- `S` — 数の小数部に持つことができる桁数を指定する0から76までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの値または文字列表現。
- Float32/64 タイプの値または文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の値または文字列表現（大文字小文字を区別しません）。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal256('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal256` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(76 - S), 1 * 10^(76 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合は例外が発生します。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する可能性があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal256(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal256('1.15', 2) = 1.15`
:::

**返される値**

- `Decimal(76, S)` 型の値。[Decimal256(S)](../data-types/int-uint.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal256(99, 1) AS a, toTypeName(a) AS type_a,
    toDecimal256(99.67, 2) AS b, toTypeName(b) AS type_b,
    toDecimal256('99.67', 3) AS c, toTypeName(c) AS type_c
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:      99
type_a: Decimal(76, 1)
b:      99.67
type_b: Decimal(76, 2)
c:      99.67
type_c: Decimal(76, 3)
```

**参照**

- [`toDecimal256OrZero`](#todecimal256orzero).
- [`toDecimal256OrNull`](#todecimal256ornull).
- [`toDecimal256OrDefault`](#todecimal256ordefault).
## toDecimal256OrZero {#todecimal256orzero}

[`toDecimal256`](#todecimal256) と同様に、この関数は入力値を [Decimal(76, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toDecimal256OrZero(expr, S)
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から76までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal256OrZero('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal256` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(76 - S), 1 * 10^(76 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

**返される値**

- 成功した場合は `Decimal(76, S)` 型の値。それ以外の場合は `0` として `S` 桁の小数を返します。 [Decimal256(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal256OrZero(toString(0.0001), 76) AS a,
    toTypeName(a),
    toDecimal256OrZero(toString('Inf'), 76) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.0001
toTypeName(a): Decimal(76, 76)
b:             0
toTypeName(b): Decimal(76, 76)
```

**参照**

- [`toDecimal256`](#todecimal256).
- [`toDecimal256OrNull`](#todecimal256ornull).
- [`toDecimal256OrDefault`](#todecimal256ordefault).
## toDecimal256OrNull {#todecimal256ornull}

[`toDecimal256`](#todecimal256) と同様に、この関数は入力値を [Nullable(Decimal(76, S))](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合は `0` を返します。

**構文**

```sql
toDecimal256OrNull(expr, S)
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から76までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal256OrNull('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal256` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(76 - S), 1 * 10^(76 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

**返される値**

- 成功した場合は `Nullable(Decimal(76, S))` 型の値。それ以外の場合は同じ型の値 `NULL` を返します。 [Decimal256(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal256OrNull(toString(1/42), 76) AS a,
    toTypeName(a),
    toDecimal256OrNull(toString('Inf'), 76) as b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.023809523809523808
toTypeName(a): Nullable(Decimal(76, 76))
b:             ᴺᵁᴸᴸ
toTypeName(b): Nullable(Decimal(76, 76))
```

**参照**

- [`toDecimal256`](#todecimal256).
- [`toDecimal256OrZero`](#todecimal256orzero).
- [`toDecimal256OrDefault`](#todecimal256ordefault).
## toDecimal256OrDefault {#todecimal256ordefault}

[`toDecimal256`](#todecimal256) と同様に、この関数は入力値を [Decimal(76, S)](../data-types/decimal.md) タイプの値に変換しますが、エラーが発生した場合はデフォルト値を返します。

**構文**

```sql
toDecimal256OrDefault(expr, S[, default])
```

**引数**

- `expr` — 数の文字列表現。 [String](../data-types/string.md)。
- `S` — 数の小数部に持つことができる桁数を指定する0から76までのスケールパラメータ。[UInt8](../data-types/int-uint.md)。
- `default` (オプション) — `Decimal256(S)` 型へのパースに失敗した場合に返すデフォルト値。 [Decimal256(S)](../data-types/decimal.md)。

サポートされている引数:
- (U)Int8/16/32/64/128/256 タイプの文字列表現。
- Float32/64 タイプの文字列表現。

サポートされていない引数:
- Float32/64 値 `NaN` および `Inf` の文字列表現。
- バイナリおよび16進数の値の文字列表現。例: `SELECT toDecimal256OrDefault('0xc0fe', 1);`。

:::note
`expr` の値が `Decimal256` の範囲を超えるとオーバーフローが発生する可能性があります: `( -1 * 10^(76 - S), 1 * 10^(76 - S) )`。
小数部に過剰な桁がある場合は切り捨てられます（丸められません）。
整数部に過剰な桁がある場合はエラーにつながります。
:::

:::warning
変換は余分な桁を切り捨て、Float32/Float64 入力で予期しない方法で動作する可能性があります。なぜなら、操作は浮動小数点命令を使用して実行されるからです。
例えば: `toDecimal256OrDefault(1.15, 2)` は `1.14` と等しいです。なぜなら、1.15 * 100 の浮動小数点への変換は 114.99 になるからです。
文字列入力を使用することで、操作は基礎となる整数型を使用します: `toDecimal256OrDefault('1.15', 2) = 1.15`
:::

**返される値**

- 成功した場合は `Decimal(76, S)` 型の値。それ以外の場合は渡されたデフォルト値、または渡されなかった場合は `0` を返します。 [Decimal256(S)](../data-types/decimal.md)。

**例**

クエリ:

```sql
SELECT
    toDecimal256OrDefault(toString(1/42), 76) AS a,
    toTypeName(a),
    toDecimal256OrDefault('Inf', 0, CAST('-1', 'Decimal256(0)')) AS b,
    toTypeName(b)
FORMAT Vertical;
```

結果:

```response
Row 1:
──────
a:             0.023809523809523808
toTypeName(a): Decimal(76, 76)
b:             -1
toTypeName(b): Decimal(76, 0)
```

**参照**

- [`toDecimal256`](#todecimal256).
- [`toDecimal256OrZero`](#todecimal256orzero).
- [`toDecimal256OrNull`](#todecimal256ornull).
## toString {#tostring}

数、文字列（ただし固定文字列ではない）、日付、および時間を伴う日付間での変換のための関数。
これらの関数はすべて1つの引数を受け入れます。

文字列に変換する場合、値は TabSeparated 形式（およびほぼすべての他のテキスト形式）に対して使用されるのと同じ規則を使用してフォーマットまたはパースされます。文字列をパースできない場合、例外がスローされ、要求がキャンセルされます。

日付を数に変換するとき、もしくはその逆では、日付は Unix エポックの開始からの日数に対応します。
日付と時間を数に変換する場合、その日付と時間は Unix エポックの開始からの秒数に対応します。

toDate/toDateTime 関数のための日時および時間のフォーマットは次のように定義されています。

```response
YYYY-MM-DD
YYYY-MM-DD hh:mm:ss
```

例外として、UInt32、Int32、UInt64、またはInt64数値型から日付への変換の場合、かつその数が65536以上である場合、その数は Unix タイムスタンプとして解釈され（および日数としてではなく）、日付に丸められます。このことにより、一般的な `toDate(unix_timestamp)` の書き方をサポートします。これ以外はエラーになり、より煩わしい `toDate(toDateTime(unix_timestamp))` を記述しなければなりません。

日付と時間を持つ日付の間の変換は、自然な形で、null 時間を加えるか、もしくは時間を削除する形で行われます。

数値型間の変換は、C++における異なる数値型間の代入ルールと同じです。

加えて、DateTime 引数の toString 関数は、タイムゾーンの名前を含む2番目の文字列引数を取ることができます。例: `Asia/Yekaterinburg` この場合、時間は指定されたタイムゾーンに従ってフォーマットされます。

**例**

クエリ:

```sql
SELECT
    now() AS ts,
    time_zone,
    toString(ts, time_zone) AS str_tz_datetime
FROM system.time_zones
WHERE time_zone LIKE 'Europe%'
LIMIT 10
```

結果:

```response
┌──────────────────ts─┬─time_zone─────────┬─str_tz_datetime─────┐
│ 2023-09-08 19:14:59 │ Europe/Amsterdam  │ 2023-09-08 21:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Andorra    │ 2023-09-08 21:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Astrakhan  │ 2023-09-08 23:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Athens     │ 2023-09-08 22:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Belfast    │ 2023-09-08 20:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Belgrade   │ 2023-09-08 21:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Berlin     │ 2023-09-08 21:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Bratislava │ 2023-09-08 21:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Brussels   │ 2023-09-08 21:14:59 │
│ 2023-09-08 19:14:59 │ Europe/Bucharest  │ 2023-09-08 22:14:59 │
└─────────────────────┴───────────────────┴─────────────────────┘
```

また、`toUnixTimestamp` 関数も参照してください。
## toFixedString {#tofixedstring}

[文字列](../data-types/string.md)型の引数を[FixedString(N)](../data-types/fixedstring.md)型（固定長Nの文字列）に変換します。文字列のバイト数がN未満の場合、右側にヌルバイトでパディングされます。文字列のバイト数がNを超える場合、例外がスローされます。

**構文**

```sql
toFixedString(s, N)
```

**引数**

- `s` — 固定文字列に変換する文字列。 [文字列](../data-types/string.md)。
- `N` — 長さN。 [UInt8](../data-types/int-uint.md)

**戻り値**

- `s`のN長さの固定文字列。 [FixedString](../data-types/fixedstring.md)。

**例**

クエリ:

``` sql
SELECT toFixedString('foo', 8) AS s;
```

結果:

```response
┌─s─────────────┐
│ foo\0\0\0\0\0 │
└───────────────┘
```

## toStringCutToZero {#tostringcuttozero}

文字列または固定文字列の引数を受け取ります。最初に見つかったゼロバイトでコンテンツを切り捨てた文字列を返します。

**構文**

```sql
toStringCutToZero(s)
```

**例**

クエリ:

``` sql
SELECT toFixedString('foo', 8) AS s, toStringCutToZero(s) AS s_cut;
```

結果:

```response
┌─s─────────────┬─s_cut─┐
│ foo\0\0\0\0\0 │ foo   │
└───────────────┴───────┘
```

クエリ:

``` sql
SELECT toFixedString('foo\0bar', 8) AS s, toStringCutToZero(s) AS s_cut;
```

結果:

```response
┌─s──────────┬─s_cut─┐
│ foo\0bar\0 │ foo   │
└────────────┴───────┘
```

## toDecimalString {#todecimalstring}

数値を文字列に変換し、小数点以下の桁数をユーザーが指定します。

**構文**

``` sql
toDecimalString(number, scale)
```

**引数**

- `number` — 文字列として表現される値。 [Int, UInt](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Decimal](../data-types/decimal.md)。
- `scale` — 小数点以下の桁数。 [UInt8](../data-types/int-uint.md)。
    * [Decimal](../data-types/decimal.md) と [Int, UInt](../data-types/int-uint.md) の最大スケールは77です（Decimalの有効数字の最大数です）。
    * [Float](../data-types/float.md) の最大スケールは60です。

**戻り値**

- 指定された小数点以下の桁数（スケール）を持つ[文字列](../data-types/string.md)として表現された入力値。
    要求されたスケールが元の数のスケールより小さい場合、数は通常の算数に従って切り上げまたは切り捨てられます。

**例**

クエリ:

``` sql
SELECT toDecimalString(CAST('64.32', 'Float64'), 5);
```

結果:

```response
┌toDecimalString(CAST('64.32', 'Float64'), 5)─┐
│ 64.32000                                    │
└─────────────────────────────────────────────┘
```

## reinterpretAsUInt8 {#reinterpretasuint8}

入力値をUInt8型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsUInt8(x)
```

**引数**

- `x`：UInt8として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- UInt8として再解釈された値`x`。 [UInt8](../data-types/int-uint.md/#uint8-uint16-uint32-uint64-uint128-uint256-int8-int16-int32-int64-int128-int256)。

**例**

クエリ:

```sql
SELECT
    toInt8(257) AS x,
    toTypeName(x),
    reinterpretAsUInt8(x) AS res,
    toTypeName(res);
```

結果:

```response
┌─x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 1 │ Int8          │   1 │ UInt8           │
└───┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsUInt16 {#reinterpretasuint16}

入力値をUInt16型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsUInt16(x)
```

**引数**

- `x`：UInt16として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- UInt16として再解釈された値`x`。 [UInt16](../data-types/int-uint.md/#uint8-uint16-uint32-uint64-uint128-uint256-int8-int16-int32-int64-int128-int256)。

**例**

クエリ:

```sql
SELECT
    toUInt8(257) AS x,
    toTypeName(x),
    reinterpretAsUInt16(x) AS res,
    toTypeName(res);
```

結果:

```response
┌─x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 1 │ UInt8         │   1 │ UInt16          │
└───┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsUInt32 {#reinterpretasuint32}

入力値をUInt32型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsUInt32(x)
```

**引数**

- `x`：UInt32として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- UInt32として再解釈された値`x`。 [UInt32](../data-types/int-uint.md/#uint8-uint16-uint32-uint64-uint128-uint256-int8-int16-int32-int64-int128-int256)。

**例**

クエリ:

```sql
SELECT
    toUInt16(257) AS x,
    toTypeName(x),
    reinterpretAsUInt32(x) AS res,
    toTypeName(res)
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ UInt16        │ 257 │ UInt32          │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsUInt64 {#reinterpretasuint64}

入力値をUInt64型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsUInt64(x)
```

**引数**

- `x`：UInt64として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- UInt64として再解釈された値`x`。 [UInt64](../data-types/int-uint.md/#uint8-uint16-uint32-uint64-uint128-uint256-int8-int16-int32-int64-int128-int256)。

**例**

クエリ:

```sql
SELECT
    toUInt32(257) AS x,
    toTypeName(x),
    reinterpretAsUInt64(x) AS res,
    toTypeName(res)
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ UInt32        │ 257 │ UInt64          │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsUInt128 {#reinterpretasuint128}

入力値をUInt128型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsUInt128(x)
```

**引数**

- `x`：UInt128として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- UInt128として再解釈された値`x`。 [UInt128](../data-types/int-uint.md/#uint8-uint16-uint32-uint64-uint128-uint256-int8-int16-int32-int64-int128-int256)。

**例**

クエリ:

```sql
SELECT
    toUInt64(257) AS x,
    toTypeName(x),
    reinterpretAsUInt128(x) AS res,
    toTypeName(res)
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ UInt64        │ 257 │ UInt128         │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsUInt256 {#reinterpretasuint256}

入力値をUInt256型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsUInt256(x)
```

**引数**

- `x`：UInt256として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- UInt256として再解釈された値`x`。 [UInt256](../data-types/int-uint.md/#uint8-uint16-uint32-uint64-uint128-uint256-int8-int16-int32-int64-int128-int256)。

**例**

クエリ:

```sql
SELECT
    toUInt128(257) AS x,
    toTypeName(x),
    reinterpretAsUInt256(x) AS res,
    toTypeName(res)
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ UInt128       │ 257 │ UInt256         │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsInt8 {#reinterpretasint8}

入力値をInt8型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsInt8(x)
```

**引数**

- `x`：Int8として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Int8として再解釈された値`x`。 [Int8](../data-types/int-uint.md/#int-ranges)。

**例**

クエリ:

```sql
SELECT
    toUInt8(257) AS x,
    toTypeName(x),
    reinterpretAsInt8(x) AS res,
    toTypeName(res);
```

結果:

```response
┌─x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 1 │ UInt8         │   1 │ Int8            │
└───┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsInt16 {#reinterpretasint16}

入力値をInt16型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsInt16(x)
```

**引数**

- `x`：Int16として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Int16として再解釈された値`x`。 [Int16](../data-types/int-uint.md/#int-ranges)。

**例**

クエリ:

```sql
SELECT
    toInt8(257) AS x,
    toTypeName(x),
    reinterpretAsInt16(x) AS res,
    toTypeName(res);
```

結果:

```response
┌─x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 1 │ Int8          │   1 │ Int16           │
└───┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsInt32 {#reinterpretasint32}

入力値をInt32型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsInt32(x)
```

**引数**

- `x`：Int32として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Int32として再解釈された値`x`。 [Int32](../data-types/int-uint.md/#int-ranges)。

**例**

クエリ:

```sql
SELECT
    toInt16(257) AS x,
    toTypeName(x),
    reinterpretAsInt32(x) AS res,
    toTypeName(res);
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ Int16         │ 257 │ Int32           │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsInt64 {#reinterpretasint64}

入力値をInt64型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsInt64(x)
```

**引数**

- `x`：Int64として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Int64として再解釈された値`x`。 [Int64](../data-types/int-uint.md/#int-ranges)。

**例**

クエリ:

```sql
SELECT
    toInt32(257) AS x,
    toTypeName(x),
    reinterpretAsInt64(x) AS res,
    toTypeName(res);
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ Int32         │ 257 │ Int64           │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsInt128 {#reinterpretasint128}

入力値をInt128型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsInt128(x)
```

**引数**

- `x`：Int128として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Int128として再解釈された値`x`。 [Int128](../data-types/int-uint.md/#int-ranges)。

**例**

クエリ:

```sql
SELECT
    toInt64(257) AS x,
    toTypeName(x),
    reinterpretAsInt128(x) AS res,
    toTypeName(res);
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ Int64         │ 257 │ Int128          │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsInt256 {#reinterpretasint256}

入力値をInt256型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsInt256(x)
```

**引数**

- `x`：Int256として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Int256として再解釈された値`x`。 [Int256](../data-types/int-uint.md/#int-ranges)。

**例**

クエリ:

```sql
SELECT
    toInt128(257) AS x,
    toTypeName(x),
    reinterpretAsInt256(x) AS res,
    toTypeName(res);
```

結果:

```response
┌───x─┬─toTypeName(x)─┬─res─┬─toTypeName(res)─┐
│ 257 │ Int128        │ 257 │ Int256          │
└─────┴───────────────┴─────┴─────────────────┘
```

## reinterpretAsFloat32 {#reinterpretasfloat32}

入力値をFloat32型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsFloat32(x)
```

**引数**

- `x`：Float32として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Float32として再解釈された値`x`。 [Float32](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT reinterpretAsUInt32(toFloat32(0.2)) as x, reinterpretAsFloat32(x);
```

結果:

```response
┌──────────x─┬─reinterpretAsFloat32(x)─┐
│ 1045220557 │                     0.2 │
└────────────┴─────────────────────────┘
```

## reinterpretAsFloat64 {#reinterpretasfloat64}

入力値をFloat64型の値として解釈するバイト再解釈を実行します。[`CAST`](#cast)とは異なり、元の値を保持しようとはしません。ターゲット型が入力型を表現できない場合、出力は無意味になります。

**構文**

```sql
reinterpretAsFloat64(x)
```

**引数**

- `x`：Float64として再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- Float64として再解釈された値`x`。 [Float64](../data-types/float.md)。

**例**

クエリ:

```sql
SELECT reinterpretAsUInt64(toFloat64(0.2)) as x, reinterpretAsFloat64(x);
```

結果:

```response
┌───────────────────x─┬─reinterpretAsFloat64(x)─┐
│ 4596373779694328218 │                     0.2 │
└─────────────────────┴─────────────────────────┘
```

## reinterpretAsDate {#reinterpretasdate}

文字列、固定文字列または数値を受け入れ、ホストオーダー（リトルエンディアン）で数値としてバイトを解釈します。Unixエポックの始まりからの日数として解釈された数値を持つ日付を返します。

**構文**

```sql
reinterpretAsDate(x)
```

**引数**

- `x`：Unixエポックの始まりからの日数。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- 日付。 [Date](../data-types/date.md)。

**実装の詳細**

:::note
提供された文字列が十分に長くない場合、関数は文字列が必要な数のヌルバイトでパディングされているかのように動作します。文字列が必要以上に長い場合、余分なバイトは無視されます。
:::

**例**

クエリ:

```sql
SELECT reinterpretAsDate(65), reinterpretAsDate('A');
```

結果:

```response
┌─reinterpretAsDate(65)─┬─reinterpretAsDate('A')─┐
│            1970-03-07 │             1970-03-07 │
└───────────────────────┴────────────────────────┘
```

## reinterpretAsDateTime {#reinterpretasdatetime}

これらの関数は文字列を受け入れ、文字列の先頭に配置されたバイトをホストオーダー（リトルエンディアン）で数値として解釈します。Unixエポックの始まりからの秒数として解釈された時間を持つ日付を返します。

**構文**

```sql
reinterpretAsDateTime(x)
```

**引数**

- `x`：Unixエポックの始まりからの秒数。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)、 [UUID](../data-types/uuid.md)、 [文字列](../data-types/string.md)または [FixedString](../data-types/fixedstring.md)。

**戻り値**

- 日付と時間。 [DateTime](../data-types/datetime.md)。

**実装の詳細**

:::note
提供された文字列が十分に長くない場合、関数は文字列が必要な数のヌルバイトでパディングされているかのように動作します。文字列が必要以上に長い場合、余分なバイトは無視されます。
:::

**例**

クエリ:

```sql
SELECT reinterpretAsDateTime(65), reinterpretAsDateTime('A');
```

結果:

```response
┌─reinterpretAsDateTime(65)─┬─reinterpretAsDateTime('A')─┐
│       1970-01-01 01:01:05 │        1970-01-01 01:01:05 │
└───────────────────────────┴────────────────────────────┘
```

## reinterpretAsString {#reinterpretasstring}

この関数は数値、日付または時間のある日付を受け入れ、ホストオーダー（リトルエンディアン）で対応する値を表すバイトを含む文字列を返します。ヌルバイトは末尾から削除されます。たとえば、UInt32型の値255は1バイトの長さの文字列です。

**構文**

```sql
reinterpretAsString(x)
```

**引数**

- `x`：文字列に再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)。

**戻り値**

- `x`を表すバイトを含む文字列。 [文字列](../data-types/fixedstring.md)。

**例**

クエリ:

```sql
SELECT
    reinterpretAsString(toDateTime('1970-01-01 01:01:05')),
    reinterpretAsString(toDate('1970-03-07'));
```

結果:

```response
┌─reinterpretAsString(toDateTime('1970-01-01 01:01:05'))─┬─reinterpretAsString(toDate('1970-03-07'))─┐
│ A                                                      │ A                                         │
└────────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```

## reinterpretAsFixedString {#reinterpretasfixedstring}

この関数は数値、日付または日時を受け入れ、ホストオーダー（リトルエンディアン）で対応する値を表すバイトを含むFixedStringを返します。ヌルバイトは末尾から削除されます。たとえば、UInt32型の値255は1バイトの長さのFixedStringです。

**構文**

```sql
reinterpretAsFixedString(x)
```

**引数**

- `x`：文字列に再解釈する値。[(U)Int*](../data-types/int-uint.md)、 [Float](../data-types/float.md)、 [Date](../data-types/date.md)、 [DateTime](../data-types/datetime.md)。

**戻り値**

- `x`を表すバイトを含む固定文字列。 [FixedString](../data-types/fixedstring.md)。

**例**

クエリ:

```sql
SELECT
    reinterpretAsFixedString(toDateTime('1970-01-01 01:01:05')),
    reinterpretAsFixedString(toDate('1970-03-07'));
```

結果:

```response
┌─reinterpretAsFixedString(toDateTime('1970-01-01 01:01:05'))─┬─reinterpretAsFixedString(toDate('1970-03-07'))─┐
│ A                                                           │ A                                              │
└─────────────────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

## reinterpretAsUUID {#reinterpretasuuid}

:::note
ここにリストされているUUID関数に加えて、専用の[UUID関数文書](../functions/uuid-functions.md)があります。
:::

16バイトの文字列を受け入れ、各8バイトの半分をリトルエンディアンのバイト順序で解釈してUUIDを返します。文字列が十分に長くない場合、関数は文字列が必要な数のヌルバイトでパディングされているかのように動作します。文字列が16バイトを超える場合、末尾の余分なバイトは無視されます。

**構文**

``` sql
reinterpretAsUUID(fixed_string)
```

**引数**

- `fixed_string` — ビッグエンディアンのバイト文字列。 [FixedString](../data-types/fixedstring.md/#fixedstring)。

**戻り値**

- UUID型の値。 [UUID](../data-types/uuid.md/#uuid-data-type)。

**例**

文字列からUUIDに。

クエリ:

``` sql
SELECT reinterpretAsUUID(reverse(unhex('000102030405060708090a0b0c0d0e0f')));
```

結果:

```response
┌─reinterpretAsUUID(reverse(unhex('000102030405060708090a0b0c0d0e0f')))─┐
│                                  08090a0b-0c0d-0e0f-0001-020304050607 │
└───────────────────────────────────────────────────────────────────────┘
```

文字列からUUIDへの往復。

クエリ:

``` sql
WITH
    generateUUIDv4() AS uuid,
    identity(lower(hex(reverse(reinterpretAsString(uuid))))) AS str,
    reinterpretAsUUID(reverse(unhex(str))) AS uuid2
SELECT uuid = uuid2;
```

結果:

```response
┌─equals(uuid, uuid2)─┐
│                   1 │
└─────────────────────┘
```

## reinterpret {#reinterpret}

`x`値のソースのメモリ内のバイトシーケンスをそのまま使用して、ターゲット型に再解釈します。

**構文**

``` sql
reinterpret(x, type)
```

**引数**

- `x` — 任意の型。
- `type` — ターゲット型。 [文字列](../data-types/string.md)。

**戻り値**

- ターゲット型の値。

**例**

クエリ:

```sql
SELECT reinterpret(toInt8(-1), 'UInt8') as int_to_uint,
    reinterpret(toInt8(1), 'Float32') as int_to_float,
    reinterpret('1', 'UInt32') as string_to_int;
```

結果:

```text
┌─int_to_uint─┬─int_to_float─┬─string_to_int─┐
│         255 │        1e-45 │            49 │
└─────────────┴──────────────┴───────────────┘
```

## CAST {#cast}

入力値を指定されたデータ型に変換します。 [`reinterpret`](#reinterpret)関数とは異なり、`CAST`は新しいデータ型を使用して同じ値を表現しようとします。変換ができない場合は例外がスローされます。
複数の構文バリアントがサポートされています。

**構文**

``` sql
CAST(x, T)
CAST(x AS t)
x::t
```

**引数**

- `x` — 変換される値。任意の型の値。
- `T` — 目標データ型の名前。 [文字列](../data-types/string.md)。
- `t` — 目標データ型。

**戻り値**

- 変換された値。

:::note
入力値がターゲット型の範囲に収まらない場合、結果はオーバーフローします。たとえば、`CAST(-1, 'UInt8')`は`255`を返します。
:::

**例**

クエリ:

```sql
SELECT
    CAST(toInt8(-1), 'UInt8') AS cast_int_to_uint,
    CAST(1.5 AS Decimal(3,2)) AS cast_float_to_decimal,
    '1'::Int32 AS cast_string_to_int;
```

結果:

```yaml
┌─cast_int_to_uint─┬─cast_float_to_decimal─┬─cast_string_to_int─┐
│              255 │                  1.50 │                  1 │
└──────────────────┴───────────────────────┴────────────────────┘
```

クエリ:

``` sql
SELECT
    '2016-06-15 23:00:00' AS timestamp,
    CAST(timestamp AS DateTime) AS datetime,
    CAST(timestamp AS Date) AS date,
    CAST(timestamp, 'String') AS string,
    CAST(timestamp, 'FixedString(22)') AS fixed_string;
```

結果:

```response
┌─timestamp───────────┬────────────datetime─┬───────date─┬─string──────────────┬─fixed_string──────────────┐
│ 2016-06-15 23:00:00 │ 2016-06-15 23:00:00 │ 2016-06-15 │ 2016-06-15 23:00:00 │ 2016-06-15 23:00:00\0\0\0 │
└─────────────────────┴─────────────────────┴────────────┴─────────────────────┴───────────────────────────┘
```

[FixedString (N)](../data-types/fixedstring.md)への変換は、[文字列](../data-types/string.md)または[FixedString](../data-types/fixedstring.md)型の引数にのみ適用されます。

[Nullable](../data-types/nullable.md)型への変換とその逆がサポートされています。

**例**

クエリ:

``` sql
SELECT toTypeName(x) FROM t_null;
```

結果:

```response
┌─toTypeName(x)─┐
│ Int8          │
│ Int8          │
└───────────────┘
```

クエリ:

``` sql
SELECT toTypeName(CAST(x, 'Nullable(UInt16)')) FROM t_null;
```

結果:

```response
┌─toTypeName(CAST(x, 'Nullable(UInt16)'))─┐
│ Nullable(UInt16)                        │
│ Nullable(UInt16)                        │
└─────────────────────────────────────────┘
```

**参照してください**

- [cast_keep_nullable](../../operations/settings/settings.md/#cast_keep_nullable)設定

## accurateCast(x, T) {#accuratecastx-t}

`x`を`T`データ型に変換します。

`cast`との違いは、`accurateCast`はキャスト中に数値型のオーバーフローを許可しないことです。型値`x`が型`T`の範囲に収まらない場合は例外がスローされます。

**例**

クエリ:

``` sql
SELECT cast(-1, 'UInt8') as uint8;
```

結果:

```response
┌─uint8─┐
│   255 │
└───────┘
```

クエリ:

```sql
SELECT accurateCast(-1, 'UInt8') as uint8;
```

結果:

```response
Code: 70. DB::Exception: Received from localhost:9000. DB::Exception: Value in column Int8 cannot be safely converted into type UInt8: While processing accurateCast(-1, 'UInt8') AS uint8.
```

## accurateCastOrNull(x, T) {#accuratecastornullx-t}

入力値`x`を指定されたデータ型`T`に変換します。常に[Nullable](../data-types/nullable.md)型を返し、キャスト値がターゲット型で表現できない場合は[NULL](/sql-reference/syntax#null)を返します。

**構文**

```sql
accurateCastOrNull(x, T)
```

**引数**

- `x` — 入力値。
- `T` — 戻り値のデータ型の名前。

**戻り値**

- 指定されたデータ型`T`に変換された値。

**例**

クエリ:

``` sql
SELECT toTypeName(accurateCastOrNull(5, 'UInt8'));
```

結果:

```response
┌─toTypeName(accurateCastOrNull(5, 'UInt8'))─┐
│ Nullable(UInt8)                            │
└────────────────────────────────────────────┘
```

クエリ:

``` sql
SELECT
    accurateCastOrNull(-1, 'UInt8') as uint8,
    accurateCastOrNull(128, 'Int8') as int8,
    accurateCastOrNull('Test', 'FixedString(2)') as fixed_string;
```

結果:

```response
┌─uint8─┬─int8─┬─fixed_string─┐
│  ᴺᵁᴸᴸ │ ᴺᵁᴸᴸ │ ᴺᵁᴸᴸ         │
└───────┴──────┴──────────────┘
```
## accurateCastOrDefault(x, T[, default_value]) {#accuratecastordefaultx-t-default_value}

入力値 `x` を指定されたデータ型 `T` に変換します。キャストされた値がターゲットタイプで表現できない場合、デフォルトのタイプ値または指定された `default_value` を返します。

**構文**

```sql
accurateCastOrDefault(x, T)
```

**引数**

- `x` — 入力値。
- `T` — 返されるデータ型の名前。
- `default_value` — 返されるデータ型のデフォルト値。

**返される値**

- 指定されたデータ型 `T` に変換された値。

**例**

クエリ:

``` sql
SELECT toTypeName(accurateCastOrDefault(5, 'UInt8'));
```

結果:

```response
┌─toTypeName(accurateCastOrDefault(5, 'UInt8'))─┐
│ UInt8                                         │
└───────────────────────────────────────────────┘
```

クエリ:

``` sql
SELECT
    accurateCastOrDefault(-1, 'UInt8') as uint8,
    accurateCastOrDefault(-1, 'UInt8', 5) as uint8_default,
    accurateCastOrDefault(128, 'Int8') as int8,
    accurateCastOrDefault(128, 'Int8', 5) as int8_default,
    accurateCastOrDefault('Test', 'FixedString(2)') as fixed_string,
    accurateCastOrDefault('Test', 'FixedString(2)', 'Te') as fixed_string_default;
```

結果:

```response
┌─uint8─┬─uint8_default─┬─int8─┬─int8_default─┬─fixed_string─┬─fixed_string_default─┐
│     0 │             5 │    0 │            5 │              │ Te                   │
└───────┴───────────────┴──────┴──────────────┴──────────────┴──────────────────────┘
```

## toIntervalYear {#tointervalyear}

`n` 年の間隔をデータ型 [IntervalYear](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalYear(n)
```

**引数**

- `n` — 年数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 年の間隔。 [IntervalYear](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalYear(1) AS interval_to_year
SELECT date + interval_to_year AS result
```

結果:

```response
┌─────result─┐
│ 2025-06-15 │
└────────────┘
```

## toIntervalQuarter {#tointervalquarter}

`n` 四半期の間隔をデータ型 [IntervalQuarter](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalQuarter(n)
```

**引数**

- `n` — 四半期数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 四半期の間隔。 [IntervalQuarter](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalQuarter(1) AS interval_to_quarter
SELECT date + interval_to_quarter AS result
```

結果:

```response
┌─────result─┐
│ 2024-09-15 │
└────────────┘
```

## toIntervalMonth {#tointervalmonth}

`n` 月の間隔をデータ型 [IntervalMonth](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalMonth(n)
```

**引数**

- `n` — 月数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 月の間隔。 [IntervalMonth](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalMonth(1) AS interval_to_month
SELECT date + interval_to_month AS result
```

結果:

```response
┌─────result─┐
│ 2024-07-15 │
└────────────┘
```

## toIntervalWeek {#tointervalweek}

`n` 週間の間隔をデータ型 [IntervalWeek](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalWeek(n)
```

**引数**

- `n` — 週数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 週間の間隔。 [IntervalWeek](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalWeek(1) AS interval_to_week
SELECT date + interval_to_week AS result
```

結果:

```response
┌─────result─┐
│ 2024-06-22 │
└────────────┘
```

## toIntervalDay {#tointervalday}

`n` 日の間隔をデータ型 [IntervalDay](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalDay(n)
```

**引数**

- `n` — 日数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 日の間隔。 [IntervalDay](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalDay(5) AS interval_to_days
SELECT date + interval_to_days AS result
```

結果:

```response
┌─────result─┐
│ 2024-06-20 │
└────────────┘
```

## toIntervalHour {#tointervalhour}

`n` 時間の間隔をデータ型 [IntervalHour](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalHour(n)
```

**引数**

- `n` — 時間数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 時間の間隔。 [IntervalHour](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalHour(12) AS interval_to_hours
SELECT date + interval_to_hours AS result
```

結果:

```response
┌──────────────result─┐
│ 2024-06-15 12:00:00 │
└─────────────────────┘
```

## toIntervalMinute {#tointervalminute}

`n` 分の間隔をデータ型 [IntervalMinute](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalMinute(n)
```

**引数**

- `n` — 分数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 分の間隔。 [IntervalMinute](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalMinute(12) AS interval_to_minutes
SELECT date + interval_to_minutes AS result
```

結果:

```response
┌──────────────result─┐
│ 2024-06-15 00:12:00 │
└─────────────────────┘
```

## toIntervalSecond {#tointervalsecond}

`n` 秒の間隔をデータ型 [IntervalSecond](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalSecond(n)
```

**引数**

- `n` — 秒数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` 秒の間隔。 [IntervalSecond](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDate('2024-06-15') AS date,
    toIntervalSecond(30) AS interval_to_seconds
SELECT date + interval_to_seconds AS result
```

結果:

```response
┌──────────────result─┐
│ 2024-06-15 00:00:30 │
└─────────────────────┘
```

## toIntervalMillisecond {#tointervalmillisecond}

`n` ミリ秒の間隔をデータ型 [IntervalMillisecond](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalMillisecond(n)
```

**引数**

- `n` — ミリ秒数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` ミリ秒の間隔。 [IntervalMilliseconds](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDateTime('2024-06-15') AS date,
    toIntervalMillisecond(30) AS interval_to_milliseconds
SELECT date + interval_to_milliseconds AS result
```

結果:

```response
┌──────────────────result─┐
│ 2024-06-15 00:00:00.030 │
└─────────────────────────┘
```

## toIntervalMicrosecond {#tointervalmicrosecond}

`n` マイクロ秒の間隔をデータ型 [IntervalMicrosecond](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalMicrosecond(n)
```

**引数**

- `n` — マイクロ秒数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` マイクロ秒の間隔。 [IntervalMicrosecond](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDateTime('2024-06-15') AS date,
    toIntervalMicrosecond(30) AS interval_to_microseconds
SELECT date + interval_to_microseconds AS result
```

結果:

```response
┌─────────────────────result─┐
│ 2024-06-15 00:00:00.000030 │
└────────────────────────────┘
```

## toIntervalNanosecond {#tointervalnanosecond}

`n` ナノ秒の間隔をデータ型 [IntervalNanosecond](../data-types/special-data-types/interval.md) として返します。

**構文**

``` sql
toIntervalNanosecond(n)
```

**引数**

- `n` — ナノ秒数。整数またはその文字列表現、及び浮動小数点数。[(U)Int*](../data-types/int-uint.md)/[Float*](../data-types/float.md)/[String](../data-types/string.md)。

**返される値**

- `n` ナノ秒の間隔。 [IntervalNanosecond](../data-types/special-data-types/interval.md)。

**例**

クエリ:

``` sql
WITH
    toDateTime('2024-06-15') AS date,
    toIntervalNanosecond(30) AS interval_to_nanoseconds
SELECT date + interval_to_nanoseconds AS result
```

結果:

```response
┌────────────────────────result─┐
│ 2024-06-15 00:00:00.000000030 │
└───────────────────────────────┘
```

## parseDateTime {#parsedatetime}

[String](../data-types/string.md) を [DateTime](../data-types/datetime.md) に変換します。変換は [MySQL フォーマット文字列](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_date-format) に従います。

この関数は関数 [formatDateTime](../functions/date-time-functions.md#date_time_functions-formatDateTime) の逆の操作です。

**構文**

``` sql
parseDateTime(str[, format[, timezone]])
```

**引数**

- `str` — パースされる文字列
- `format` — フォーマット文字列。オプション。指定しない場合は `%Y-%m-%d %H:%i:%s`。
- `timezone` — [タイムゾーン](operations/server-configuration-parameters/settings.md#timezone)。オプション。

**返される値**

MySQL スタイルのフォーマット文字列に従って入力文字列からパースされた [DateTime](../data-types/datetime.md) 値を返します。

**サポートされているフォーマット仕様子**

[formatDateTime](../functions/date-time-functions.md#date_time_functions-formatDateTime) にリストされているすべてのフォーマット仕様子。ただし、以下を除く：
- %Q: 四半期 (1-4)

**例**

``` sql
SELECT parseDateTime('2021-01-04+23:00:00', '%Y-%m-%d+%H:%i:%s')

┌─parseDateTime('2021-01-04+23:00:00', '%Y-%m-%d+%H:%i:%s')─┐
│                                       2021-01-04 23:00:00 │
└───────────────────────────────────────────────────────────┘
```

エイリアス: `TO_TIMESTAMP`。

## parseDateTimeOrZero {#parsedatetimeorzero}

[parseDateTime](#parsedatetime) と同じですが、処理できない日付フォーマットに遭遇するとゼロ日付を返します。

## parseDateTimeOrNull {#parsedatetimeornull}

[parseDateTime](#parsedatetime) と同じですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

エイリアス: `str_to_date`。

## parseDateTimeInJodaSyntax {#parsedatetimeinjodasyntax}

[parseDateTime](#parsedatetime) に似ていますが、フォーマット文字列が [Joda](https://joda-time.sourceforge.net/apidocs/org/joda/time/format/DateTimeFormat.html) で MySQL 構文ではありません。

この関数は関数 [formatDateTimeInJodaSyntax](../functions/date-time-functions.md#date_time_functions-formatDateTimeInJodaSyntax) の逆の操作です。

**構文**

``` sql
parseDateTimeInJodaSyntax(str[, format[, timezone]])
```

**引数**

- `str` — パースされる文字列
- `format` — フォーマット文字列。オプション。指定しない場合は `yyyy-MM-dd HH:mm:ss`。
- `timezone` — [タイムゾーン](operations/server-configuration-parameters/settings.md#timezone)。オプション。

**返される値**

Joda スタイルのフォーマット文字列に従って入力文字列からパースされた [DateTime](../data-types/datetime.md) 値を返します。

**サポートされているフォーマット仕様子**

[formatDateTimeInJoda](../functions/date-time-functions.md#date_time_functions-formatDateTime) にリストされているすべてのフォーマット仕様子がサポートされます。ただし、以下を除く：
- S: 秒の分数
- z: タイムゾーン
- Z: タイムゾーンオフセット/ID

**例**

``` sql
SELECT parseDateTimeInJodaSyntax('2023-02-24 14:53:31', 'yyyy-MM-dd HH:mm:ss', 'Europe/Minsk')

┌─parseDateTimeInJodaSyntax('2023-02-24 14:53:31', 'yyyy-MM-dd HH:mm:ss', 'Europe/Minsk')─┐
│                                                                     2023-02-24 14:53:31 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## parseDateTimeInJodaSyntaxOrZero {#parsedatetimeinjodasyntaxorzero}

[parseDateTimeInJodaSyntax](#parsedatetimeinjodasyntax) と同じですが、処理できない日付フォーマットに遭遇するとゼロ日付を返します。

## parseDateTimeInJodaSyntaxOrNull {#parsedatetimeinjodasyntaxornull}

[parseDateTimeInJodaSyntax](#parsedatetimeinjodasyntax) と同じですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTime64 {#parsedatetime64}

[Str]: [String](../data-types/string.md) を [DateTime64](../data-types/datetime64.md) に変換します。[MySQL フォーマット文字列](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_date-format) に従います。

**構文**

``` sql
parseDateTime64(str[, format[, timezone]])
```

**引数**

- `str` — パースされる文字列。
- `format` — フォーマット文字列。オプション。指定しない場合は `%Y-%m-%d %H:%i:%s.%f`。
- `timezone` — [タイムゾーン](/operations/server-configuration-parameters/settings.md#timezone)。オプション。

**返される値**

入力文字列から MySQL スタイルのフォーマット文字列に従ってパースされた [DateTime64](../data-types/datetime64.md) 値を返します。
返される値の精度は 6 です。

## parseDateTime64OrZero {#parsedatetime64orzero}

[parseDateTime64](#parsedatetime64) と同じですが、処理できない日付フォーマットに遭遇するとゼロ日付を返します。

## parseDateTime64OrNull {#parsedatetime64ornull}

[parseDateTime64](#parsedatetime64) と同じですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTime64InJodaSyntax {#parsedatetime64injodasyntax}

[Str]: [String](../data-types/string.md) を [DateTime64](../data-types/datetime64.md) に変換します。[Joda フォーマット文字列](https://joda-time.sourceforge.net/apidocs/org/joda/time/format/DateTimeFormat.html) に従います。

**構文**

``` sql
parseDateTime64InJodaSyntax(str[, format[, timezone]])
```

**引数**

- `str` — パースされる文字列。
- `format` — フォーマット文字列。オプション。指定しない場合は `yyyy-MM-dd HH:mm:ss`。
- `timezone` — [タイムゾーン](/operations/server-configuration-parameters/settings.md#timezone)。オプション。

**返される値**

入力文字列から Joda スタイルのフォーマット文字列に従ってパースされた [DateTime64](../data-types/datetime64.md) 値を返します。
返される値の精度は、フォーマット文字列内の `S` プレースホルダーの数に等しくなります（最大で 6）。

## parseDateTime64InJodaSyntaxOrZero {#parsedatetime64injodasyntaxorzero}

[parseDateTime64InJodaSyntax](#parsedatetime64injodasyntax) と同じですが、処理できない日付フォーマットに遭遇するとゼロ日付を返します。

## parseDateTime64InJodaSyntaxOrNull {#parsedatetime64injodasyntaxornull}

[parseDateTime64InJodaSyntax](#parsedatetime64injodasyntax) と同じですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTimeBestEffort {#parsedatetimebesteffort}

## parseDateTime32BestEffort {#parsedatetime32besteffort}

[Str]を[DateTime](../data-types/datetime.md/#data_type-datetime)データ型に変換します。

この関数は[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)、[RFC 1123 - 5.2.14 RFC-822 日付と時刻仕様](https://tools.ietf.org/html/rfc1123#page-55)、ClickHouse および他のいくつかの日付および時刻フォーマットをパースします。

**構文**

``` sql
parseDateTimeBestEffort(time_string [, time_zone])
```

**引数**

- `time_string` — 変換する日付と時刻を含む文字列。 [String](../data-types/string.md)。
- `time_zone` — タイムゾーン。この関数は `time_string` をタイムゾーンに従ってパースします。 [String](../data-types/string.md)。

**サポートされている非標準フォーマット**

- 9..10 桁の [unix タイムスタンプ](https://en.wikipedia.org/wiki/Unix_time) を含む文字列。
- 日付および時刻コンポーネントを持つ文字列: `YYYYMMDDhhmmss`、`DD/MM/YYYY hh:mm:ss`、`DD-MM-YY hh:mm`、`YYYY-MM-DD hh:mm:ss` など。
- 日付を含むが時刻コンポーネントを含まない文字列: `YYYY`、`YYYYMM`、`YYYY*MM`、`DD/MM/YYYY`、`DD-MM-YY` など。
- 日付と時刻を含む文字列: `DD`、`DD hh`、`DD hh:mm`。この場合 `MM` は `01` で置き換えられます。
- 日付と時刻、及びタイムゾーンオフセット情報を含む文字列: `YYYY-MM-DD hh:mm:ss ±h:mm` など。例えば、`2020-12-12 17:36:00 -5:00`。
- [syslog タイムスタンプ](https://datatracker.ietf.org/doc/html/rfc3164#section-4.1.2): `Mmm dd hh:mm:ss`。例えば、`Jun  9 14:20:32`。

区切り文字を含むすべてのフォーマットに対して、関数は月名をその完全な名前または月名の最初の三文字で表現します。例: `24/DEC/18`、`24-Dec-18`、`01-September-2018`。
年が指定されていない場合、現在の年と等しいと見なされます。結果として得られた DateTime が未来にある場合（現在の瞬間を過ぎた場合）、現在の年は前の年に置き換えられます。

**返される値**

- 変換された `time_string` を [DateTime](../data-types/datetime.md) データ型にします。

**例**

クエリ:

``` sql
SELECT parseDateTimeBestEffort('23/10/2020 12:12:57')
AS parseDateTimeBestEffort;
```

結果:

```response
┌─parseDateTimeBestEffort─┐
│     2020-10-23 12:12:57 │
└─────────────────────────┘
```

クエリ:

``` sql
SELECT parseDateTimeBestEffort('Sat, 18 Aug 2018 07:22:16 GMT', 'Asia/Istanbul')
AS parseDateTimeBestEffort;
```

結果:

```response
┌─parseDateTimeBestEffort─┐
│     2018-08-18 10:22:16 │
└─────────────────────────┘
```

クエリ:

``` sql
SELECT parseDateTimeBestEffort('1284101485')
AS parseDateTimeBestEffort;
```

結果:

```response
┌─parseDateTimeBestEffort─┐
│     2015-07-07 12:04:41 │
└─────────────────────────┘
```

クエリ:

``` sql
SELECT parseDateTimeBestEffort('2018-10-23 10:12:12')
AS parseDateTimeBestEffort;
```

結果:

```response
┌─parseDateTimeBestEffort─┐
│     2018-10-23 10:12:12 │
└─────────────────────────┘
```

クエリ:

``` sql
SELECT toYear(now()) as year, parseDateTimeBestEffort('10 20:19');
```

結果:

```response
┌─year─┬─parseDateTimeBestEffort('10 20:19')─┐
│ 2023 │                 2023-01-10 20:19:00 │
└──────┴─────────────────────────────────────┘
```

クエリ:

``` sql
WITH
    now() AS ts_now,
    formatDateTime(ts_around, '%b %e %T') AS syslog_arg
SELECT
    ts_now,
    syslog_arg,
    parseDateTimeBestEffort(syslog_arg)
FROM (SELECT arrayJoin([ts_now - 30, ts_now + 30]) AS ts_around);
```

結果:

```response
┌──────────────ts_now─┬─syslog_arg──────┬─parseDateTimeBestEffort(syslog_arg)─┐
│ 2023-06-30 23:59:30 │ Jun 30 23:59:00 │                 2023-06-30 23:59:00 │
│ 2023-06-30 23:59:30 │ Jul  1 00:00:00 │                 2022-07-01 00:00:00 │
└─────────────────────┴─────────────────┴─────────────────────────────────────┘
```

**参照**

- [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123)
- [toDate](#todate)
- [toDateTime](#todatetime)
- [ISO 8601 announcement by @xkcd](https://xkcd.com/1179/)
- [RFC 3164](https://datatracker.ietf.org/doc/html/rfc3164#section-4.1.2)

## parseDateTimeBestEffortUS {#parsedatetimebesteffortus}

この関数は、ISO 日付フォーマット（例: `YYYY-MM-DD hh:mm:ss`）や、月と日を明確に抽出できる他の日付フォーマット（例: `YYYYMMDDhhmmss`、`YYYY-MM`、`DD hh`、または `YYYY-MM-DD hh:mm:ss ±h:mm`）に対しては [parseDateTimeBestEffort](#parsedatetimebesteffort) と同様に動作します。月と日が明確に抽出できない場合（例: `MM/DD/YYYY`、`MM-DD-YYYY`、または `MM-DD-YY`）、米国の日付フォーマットを優先します。例外として、月が 12 より大きく、31 以下の場合、[parseDateTimeBestEffort](#parsedatetimebesteffort) の動作に戻ります（例: `15/08/2020` は `2020-08-15` として解析されます）。

## parseDateTimeBestEffortOrNull {#parsedatetimebesteffortornull}

## parseDateTime32BestEffortOrNull {#parsedatetime32besteffortornull}

[parseDateTimeBestEffort](#parsedatetimebesteffort) と同じですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTimeBestEffortOrZero {#parsedatetimebesteffortorzero}

## parseDateTime32BestEffortOrZero {#parsedatetime32besteffortorzero}

[parseDateTimeBestEffort](#parsedatetimebesteffort) と同じですが、処理できない日付フォーマットに遭遇するとゼロ日付またはゼロ日時を返します。

## parseDateTimeBestEffortUSOrNull {#parsedatetimebesteffortusornull}

[parseDateTimeBestEffortUS](#parsedatetimebesteffortus) 関数と同様ですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTimeBestEffortUSOrZero {#parsedatetimebesteffortusorzero}

[parseDateTimeBestEffortUS](#parsedatetimebesteffortus) 関数と同様ですが、処理できない日付フォーマットに遭遇するとゼロ日付 (`1970-01-01`) またはゼロ日時 (`1970-01-01 00:00:00`) を返します。

## parseDateTime64BestEffort {#parsedatetime64besteffort}

[parseDateTimeBestEffort](#parsedatetimebesteffort) 関数と同様ですが、ミリ秒とマイクロ秒も解析し、[DateTime](../functions/type-conversion-functions.md/#data_type-datetime) データ型を返します。

**構文**

``` sql
parseDateTime64BestEffort(time_string [, precision [, time_zone]])
```

**引数**

- `time_string` — 変換する日付または時刻を含む文字列。 [String](../data-types/string.md)。
- `precision` — 必須の精度。 `3` — ミリ秒、`6` — マイクロ秒。デフォルトは `3`。オプション。 [UInt8](../data-types/int-uint.md)。
- `time_zone` — [タウムゾーン](/operations/server-configuration-parameters/settings.md#timezone)。この関数は `time_string` をタイムゾーンに従ってパースします。オプション。 [String](../data-types/string.md)。

**返される値**

- 変換された `time_string` を [DateTime](../data-types/datetime.md) データ型にします。

**例**

クエリ:

```sql
SELECT parseDateTime64BestEffort('2021-01-01') AS a, toTypeName(a) AS t
UNION ALL
SELECT parseDateTime64BestEffort('2021-01-01 01:01:00.12346') AS a, toTypeName(a) AS t
UNION ALL
SELECT parseDateTime64BestEffort('2021-01-01 01:01:00.12346',6) AS a, toTypeName(a) AS t
UNION ALL
SELECT parseDateTime64BestEffort('2021-01-01 01:01:00.12346',3,'Asia/Istanbul') AS a, toTypeName(a) AS t
FORMAT PrettyCompactMonoBlock;
```

結果:

```sql
┌──────────────────────────a─┬─t──────────────────────────────┐
│ 2021-01-01 01:01:00.123000 │ DateTime64(3)                  │
│ 2021-01-01 00:00:00.000000 │ DateTime64(3)                  │
│ 2021-01-01 01:01:00.123460 │ DateTime64(6)                  │
│ 2020-12-31 22:01:00.123000 │ DateTime64(3, 'Asia/Istanbul') │
└────────────────────────────┴────────────────────────────────┘
```

## parseDateTime64BestEffortUS {#parsedatetime64besteffortus}

[parseDateTime64BestEffort](#parsedatetime64besteffort) と同じですが、あいまいな場合は米国の日付フォーマット（`MM/DD/YYYY` など）を優先します。

## parseDateTime64BestEffortOrNull {#parsedatetime64besteffortornull}

[parseDateTime64BestEffort](#parsedatetime64besteffort) と同じですが、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTime64BestEffortOrZero {#parsedatetime64besteffortorzero}

[parseDateTime64BestEffort](#parsedatetime64besteffort) と同じですが、処理できない日付フォーマットに遭遇するとゼロ日付またはゼロ日時を返します。

## parseDateTime64BestEffortUSOrNull {#parsedatetime64besteffortusornull}

[parseDateTime64BestEffort](#parsedatetime64besteffort) と同じですが、あいまいな場合は米国の日付フォーマット（`MM/DD/YYYY` など）を優先し、処理できない日付フォーマットに遭遇すると `NULL` を返します。

## parseDateTime64BestEffortUSOrZero {#parsedatetime64besteffortusorzero}

[parseDateTime64BestEffort](#parsedatetime64besteffort) と同じですが、あいまいな場合は米国の日付フォーマット（`MM/DD/YYYY` など）を優先し、処理できない日付フォーマットに遭遇するとゼロ日付またはゼロ日時を返します。

## toLowCardinality {#tolowcardinality}

入力パラメータを同じデータ型の [LowCardinality](../data-types/lowcardinality.md) バージョンに変換します。

`LowCardinality` データ型からデータを変換するには [CAST](#cast) 関数を使用します。例えば、`CAST(x as String)`。

**構文**

```sql
toLowCardinality(expr)
```

**引数**

- `expr` — [表現](../syntax.md/#syntax-expressions) の結果として得られる [サポートされるデータ型](../data-types/index.md/#data_types)。

**返される値**

- `expr` の結果。 [LowCardinality](../data-types/lowcardinality.md) の型。

**例**

クエリ:

```sql
SELECT toLowCardinality('1');
```

結果:

```response
┌─toLowCardinality('1')─┐
│ 1                     │
└───────────────────────┘
```

## toUnixTimestamp64Second {#tounixtimestamp64second}

`DateTime64` を固定秒精度の `Int64` 値に変換します。入力値は精度に応じて適切にスケールアップまたはダウンされます。

:::note
出力値は UTC のタイムスタンプであり、`DateTime64` のタイムゾーンではありません。
:::

**構文**

```sql
toUnixTimestamp64Second(value)
```

**引数**

- `value` — 任意の精度の DateTime64 値。 [DateTime64](../data-types/datetime64.md)。

**返される値**

- `value` を [Int64](../data-types/int-uint.md) データ型に変換します。

**例**

クエリ:

```sql
WITH toDateTime64('2009-02-13 23:31:31.011', 3, 'UTC') AS dt64
SELECT toUnixTimestamp64Second(dt64);
```

結果:

```response
┌─toUnixTimestamp64Second(dt64)─┐
│                    1234567891 │
└───────────────────────────────┘
```

## toUnixTimestamp64Milli {#tounixtimestamp64milli}

`DateTime64` を固定ミリ秒精度の `Int64` 値に変換します。入力値は精度に応じて適切にスケールアップまたはダウンされます。

:::note
出力値は UTC のタイムスタンプであり、`DateTime64` のタイムゾーンではありません。
:::

**構文**

```sql
toUnixTimestamp64Milli(value)
```

**引数**

- `value` — 任意の精度の DateTime64 値。 [DateTime64](../data-types/datetime64.md)。

**返される値**

- `value` を [Int64](../data-types/int-uint.md) データ型に変換します。

**例**

クエリ:

```sql
WITH toDateTime64('2009-02-13 23:31:31.011', 3, 'UTC') AS dt64
SELECT toUnixTimestamp64Milli(dt64);
```

結果:

```response
┌─toUnixTimestamp64Milli(dt64)─┐
│                1234567891011 │
└──────────────────────────────┘
```

## toUnixTimestamp64Micro {#tounixtimestamp64micro}

`DateTime64` を固定マイクロ秒精度の `Int64` 値に変換します。入力値は精度に応じて適切にスケールアップまたはダウンされます。

:::note
出力値は UTC のタイムスタンプであり、`DateTime64` のタイムゾーンではありません。
:::

**構文**

```sql
toUnixTimestamp64Micro(value)
```

**引数**

- `value` — 任意の精度の DateTime64 値。 [DateTime64](../data-types/datetime64.md)。

**返される値**

- `value` を [Int64](../data-types/int-uint.md) データ型に変換します。

**例**

クエリ:

```sql
WITH toDateTime64('1970-01-15 06:56:07.891011', 6, 'UTC') AS dt64
SELECT toUnixTimestamp64Micro(dt64);
```

結果:

```response
┌─toUnixTimestamp64Micro(dt64)─┐
│                1234567891011 │
└──────────────────────────────┘
```

## toUnixTimestamp64Nano {#tounixtimestamp64nano}

`DateTime64` を固定ナノ秒精度の `Int64` 値に変換します。入力値は精度に応じて適切にスケールアップまたはダウンされます。

:::note
出力値は UTC のタイムスタンプであり、`DateTime64` のタイムゾーンではありません。
:::

**構文**

```sql
toUnixTimestamp64Nano(value)
```

**引数**

- `value` — 任意の精度の DateTime64 値。 [DateTime64](../data-types/datetime64.md)。

**返される値**

- `value` を [Int64](../data-types/int-uint.md) データ型に変換します。

**例**

クエリ:

```sql
WITH toDateTime64('1970-01-01 00:20:34.567891011', 9, 'UTC') AS dt64
SELECT toUnixTimestamp64Nano(dt64);
```

結果:

```response
┌─toUnixTimestamp64Nano(dt64)─┐
│               1234567891011 │
└─────────────────────────────┘
```
## fromUnixTimestamp64Second {#fromunixtimestamp64second}

`Int64` を固定秒精度の `DateTime64` 値に変換し、オプションでタイムゾーンを指定します。入力値は、その精度に応じて適切にスケールアップまたはスケールダウンされます。

:::note
入力値は、指定された（または暗黙の）タイムゾーンのタイムスタンプではなく、UTCタイムスタンプとして扱われることに注意してください。
:::

**構文**

``` sql
fromUnixTimestamp64Second(value[, timezone])
```

**引数**

- `value` — 任意の精度の値。[Int64](../data-types/int-uint.md)。
- `timezone` — （オプション）結果のタイムゾーン名。[String](../data-types/string.md)。

**返される値**

- 精度 `0` の DateTime64 に変換された `value`。[DateTime64](../data-types/datetime64.md)。

**例**

クエリ:

``` sql
WITH CAST(1733935988, 'Int64') AS i64
SELECT
    fromUnixTimestamp64Second(i64, 'UTC') AS x,
    toTypeName(x);
```

結果:

```response
┌───────────────────x─┬─toTypeName(x)────────┐
│ 2024-12-11 16:53:08 │ DateTime64(0, 'UTC') │
└─────────────────────┴──────────────────────┘
```
## fromUnixTimestamp64Milli {#fromunixtimestamp64milli}

`Int64` を固定ミリ秒精度の `DateTime64` 値に変換し、オプションでタイムゾーンを指定します。入力値は、その精度に応じて適切にスケールアップまたはスケールダウンされます。

:::note
入力値は、指定された（または暗黙の）タイムゾーンのタイムスタンプではなく、UTCタイムスタンプとして扱われることに注意してください。
:::

**構文**

``` sql
fromUnixTimestamp64Milli(value[, timezone])
```

**引数**

- `value` — 任意の精度の値。[Int64](../data-types/int-uint.md)。
- `timezone` — （オプション）結果のタイムゾーン名。[String](../data-types/string.md)。

**返される値**

- 精度 `3` の DateTime64 に変換された `value`。[DateTime64](../data-types/datetime64.md)。

**例**

クエリ:

``` sql
WITH CAST(1733935988123, 'Int64') AS i64
SELECT
    fromUnixTimestamp64Milli(i64, 'UTC') AS x,
    toTypeName(x);
```

結果:

```response
┌───────────────────────x─┬─toTypeName(x)────────┐
│ 2024-12-11 16:53:08.123 │ DateTime64(3, 'UTC') │
└─────────────────────────┴──────────────────────┘
```
## fromUnixTimestamp64Micro {#fromunixtimestamp64micro}

`Int64` を固定マイクロ秒精度の `DateTime64` 値に変換し、オプションでタイムゾーンを指定します。入力値は、その精度に応じて適切にスケールアップまたはスケールダウンされます。

:::note
入力値は、指定された（または暗黙の）タイムゾーンのタイムスタンプではなく、UTCタイムスタンプとして扱われることに注意してください。
:::

**構文**

``` sql
fromUnixTimestamp64Micro(value[, timezone])
```

**引数**

- `value` — 任意の精度の値。[Int64](../data-types/int-uint.md)。
- `timezone` — （オプション）結果のタイムゾーン名。[String](../data-types/string.md)。

**返される値**

- 精度 `6` の DateTime64 に変換された `value`。[DateTime64](../data-types/datetime64.md)。

**例**

クエリ:

``` sql
WITH CAST(1733935988123456, 'Int64') AS i64
SELECT
    fromUnixTimestamp64Micro(i64, 'UTC') AS x,
    toTypeName(x);
```

結果:

```response
┌──────────────────────────x─┬─toTypeName(x)────────┐
│ 2024-12-11 16:53:08.123456 │ DateTime64(6, 'UTC') │
└────────────────────────────┴──────────────────────┘
```
## fromUnixTimestamp64Nano {#fromunixtimestamp64nano}

`Int64` を固定ナノ秒精度の `DateTime64` 値に変換し、オプションでタイムゾーンを指定します。入力値は、その精度に応じて適切にスケールアップまたはスケールダウンされます。

:::note
入力値は、指定された（または暗黙の）タイムゾーンのタイムスタンプではなく、UTCタイムスタンプとして扱われることに注意してください。
:::

**構文**

``` sql
fromUnixTimestamp64Nano(value[, timezone])
```

**引数**

- `value` — 任意の精度の値。[Int64](../data-types/int-uint.md)。
- `timezone` — （オプション）結果のタイムゾーン名。[String](../data-types/string.md)。

**返される値**

- 精度 `9` の DateTime64 に変換された `value`。[DateTime64](../data-types/datetime64.md)。

**例**

クエリ:

``` sql
WITH CAST(1733935988123456789, 'Int64') AS i64
SELECT
    fromUnixTimestamp64Nano(i64, 'UTC') AS x,
    toTypeName(x);
```

結果:

```response
┌─────────────────────────────x─┬─toTypeName(x)────────┐
│ 2024-12-11 16:53:08.123456789 │ DateTime64(9, 'UTC') │
└───────────────────────────────┴──────────────────────┘
```
## formatRow {#formatrow}

任意の式を指定されたフォーマットの文字列に変換します。

**構文**

``` sql
formatRow(format, x, y, ...)
```

**引数**

- `format` — テキストフォーマット。例えば、[CSV](/interfaces/formats.md/#csv)、[TSV](/interfaces/formats.md/#tabseparated)。
- `x`,`y`, ... — 式。

**返される値**

- フォーマットされた文字列。（テキストフォーマットの場合、通常は改行文字で終わります）。

**例**

クエリ:

``` sql
SELECT formatRow('CSV', number, 'good')
FROM numbers(3);
```

結果:

```response
┌─formatRow('CSV', number, 'good')─┐
│ 0,"good"
                         │
│ 1,"good"
                         │
│ 2,"good"
                         │
└──────────────────────────────────┘
```

**注**: フォーマットに接頭辞/接尾辞が含まれている場合、各行に書き込まれます。

**例**

クエリ:

``` sql
SELECT formatRow('CustomSeparated', number, 'good')
FROM numbers(3)
SETTINGS format_custom_result_before_delimiter='<prefix>\n', format_custom_result_after_delimiter='<suffix>'
```

結果:

```response
┌─formatRow('CustomSeparated', number, 'good')─┐
│ <prefix>
0	good
<suffix>                   │
│ <prefix>
1	good
<suffix>                   │
│ <prefix>
2	good
<suffix>                   │
└──────────────────────────────────────────────┘
```

注: この関数では、行ベースのフォーマットのみがサポートされています。
## formatRowNoNewline {#formatrownonewline}

任意の式を指定されたフォーマットの文字列に変換します。これは、最後の `\n` をトリムするため、`formatRow` とは異なります。

**構文**

``` sql
formatRowNoNewline(format, x, y, ...)
```

**引数**

- `format` — テキストフォーマット。例えば、[CSV](/interfaces/formats.md/#csv)、[TSV](/interfaces/formats.md/#tabseparated)。
- `x`,`y`, ... — 式。

**返される値**

- フォーマットされた文字列。

**例**

クエリ:

``` sql
SELECT formatRowNoNewline('CSV', number, 'good')
FROM numbers(3);
```

結果:

```response
┌─formatRowNoNewline('CSV', number, 'good')─┐
│ 0,"good"                                  │
│ 1,"good"                                  │
│ 2,"good"                                  │
└───────────────────────────────────────────┘
```
