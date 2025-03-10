---
slug: /sql-reference/statements/select/order-by
sidebar_label: ORDER BY
---


# ORDER BY句

`ORDER BY`句には以下が含まれます。

- 式のリスト、例: `ORDER BY visits, search_phrase`、
- `SELECT`句内のカラムを参照する数のリスト、例: `ORDER BY 2, 1`、または
- `ALL`は`SELECT`句のすべてのカラムを意味します、例: `ORDER BY ALL`。

カラム番号によるソートを無効にするには、設定 [enable_positional_arguments](../../../operations/settings/settings.md#enable-positional-arguments) を0に設定します。
`ALL`によるソートを無効にするには、設定 [enable_order_by_all](../../../operations/settings/settings.md#enable-order-by-all) を0に設定します。

`ORDER BY`句は、ソート方向を決定するために`DESC`（降順）または`ASC`（昇順）修飾子で指定できます。
明示的なソート順が指定されていない場合、デフォルトで`ASC`が使用されます。
ソーティング方向は、リスト全体ではなく単一の式に適用されます、例: `ORDER BY Visits DESC, SearchPhrase`。
また、ソートは大文字と小文字を区別して行われます。

ソート式の値が同じ行は、任意の非決定的な順序で返されます。
`SELECT`文に`ORDER BY`句が省略された場合も、行の順序は任意で非決定的です。

## 特殊値のソート {#sorting-of-special-values}

`NaN`と`NULL`のソート順には2つのアプローチがあります:

- デフォルトまたは`NULLS LAST`修飾子を使用: 最初に値、その後`NaN`、最後に`NULL`。
- `NULLS FIRST`修飾子を使用: 最初に`NULL`、その後`NaN`、最後に他の値。

### 例 {#example}

次のテーブルについて

``` text
┌─x─┬────y─┐
│ 1 │ ᴺᵁᴸᴸ │
│ 2 │    2 │
│ 1 │  nan │
│ 2 │    2 │
│ 3 │    4 │
│ 5 │    6 │
│ 6 │  nan │
│ 7 │ ᴺᵁᴸᴸ │
│ 6 │    7 │
│ 8 │    9 │
└───┴──────┘
```

クエリ `SELECT * FROM t_null_nan ORDER BY y NULLS FIRST` を実行すると、次のようになります:

``` text
┌─x─┬────y─┐
│ 1 │ ᴺᵁᴸᴸ │
│ 7 │ ᴺᵁᴸᴸ │
│ 1 │  nan │
│ 6 │  nan │
│ 2 │    2 │
│ 2 │    2 │
│ 3 │    4 │
│ 5 │    6 │
│ 6 │    7 │
│ 8 │    9 │
└───┴──────┘
```

浮動小数点数がソートされると、`NaN`は他の値とは別に扱われます。ソート順に関係なく、`NaN`は最後に来ます。つまり、昇順のソートでは他の数値よりも大きいと見なされ、降順のソートでは他の数値よりも小さいと見なされます。

## 照合サポート {#collation-support}

[文字列](../../../sql-reference/data-types/string.md)値によるソートの場合、照合（比較）を指定できます。例: `ORDER BY SearchPhrase COLLATE 'tr'` - トルコ語アルファベットを使用して、ケースを区別せずにキーワードで昇順にソートします。`COLLATE`は、`ORDER BY`の各式に対して独立して指定できます。`ASC`または`DESC`が指定されている場合は、その後に`COLLATE`が指定されます。`COLLATE`を使用する場合、ソートは常にケースを区別しません。

照合は、[LowCardinality](../../../sql-reference/data-types/lowcardinality.md)、[Nullable](../../../sql-reference/data-types/nullable.md)、[Array](../../../sql-reference/data-types/array.md)、および[Tuple](../../../sql-reference/data-types/tuple.md)でサポートされています。

最終的に少数の行をソートするためにのみ`COLLATE`を使用することをお勧めします。なぜなら、`COLLATE`を使用したソートは通常のバイトによるソートよりも効率が悪いためです。

## 照合の例 {#collation-examples}

[文字列](../../../sql-reference/data-types/string.md)値のみの例:

入力テーブル:

``` text
┌─x─┬─s────┐
│ 1 │ bca  │
│ 2 │ ABC  │
│ 3 │ 123a │
│ 4 │ abc  │
│ 5 │ BCA  │
└───┴──────┘
```

クエリ:

```sql
SELECT * FROM collate_test ORDER BY s ASC COLLATE 'en';
```

結果:

``` text
┌─x─┬─s────┐
│ 3 │ 123a │
│ 4 │ abc  │
│ 2 │ ABC  │
│ 1 │ bca  │
│ 5 │ BCA  │
└───┴──────┘
```

[Nullable](../../../sql-reference/data-types/nullable.md)を使用した例:

入力テーブル:

``` text
┌─x─┬─s────┐
│ 1 │ bca  │
│ 2 │ ᴺᵁᴸᴸ │
│ 3 │ ABC  │
│ 4 │ 123a │
│ 5 │ abc  │
│ 6 │ ᴺᵁᴸᴸ │
│ 7 │ BCA  │
└───┴──────┘
```

クエリ:

```sql
SELECT * FROM collate_test ORDER BY s ASC COLLATE 'en';
```

結果:

``` text
┌─x─┬─s────┐
│ 4 │ 123a │
│ 5 │ abc  │
│ 3 │ ABC  │
│ 1 │ bca  │
│ 7 │ BCA  │
│ 6 │ ᴺᵁᴸᴸ │
│ 2 │ ᴺᵁᴸᴸ │
└───┴──────┘
```

[Array](../../../sql-reference/data-types/array.md)を使用した例:

入力テーブル:

``` text
┌─x─┬─s─────────────┐
│ 1 │ ['Z']         │
│ 2 │ ['z']         │
│ 3 │ ['a']         │
│ 4 │ ['A']         │
│ 5 │ ['z','a']     │
│ 6 │ ['z','a','a'] │
│ 7 │ ['']          │
└───┴───────────────┘
```

クエリ:

```sql
SELECT * FROM collate_test ORDER BY s ASC COLLATE 'en';
```

結果:

``` text
┌─x─┬─s─────────────┐
│ 7 │ ['']          │
│ 3 │ ['a']         │
│ 4 │ ['A']         │
│ 2 │ ['z']         │
│ 5 │ ['z','a']     │
│ 6 │ ['z','a','a'] │
│ 1 │ ['Z']         │
└───┴───────────────┘
```

[LowCardinality](../../../sql-reference/data-types/lowcardinality.md)文字列を使用した例:

入力テーブル:

```response
┌─x─┬─s───┐
│ 1 │ Z   │
│ 2 │ z   │
│ 3 │ a   │
│ 4 │ A   │
│ 5 │ za  │
│ 6 │ zaa │
│ 7 │     │
└───┴─────┘
```

クエリ:

```sql
SELECT * FROM collate_test ORDER BY s ASC COLLATE 'en';
```

結果:

```response
┌─x─┬─s───┐
│ 7 │     │
│ 3 │ a   │
│ 4 │ A   │
│ 2 │ z   │
│ 1 │ Z   │
│ 5 │ za  │
│ 6 │ zaa │
└───┴─────┘
```

[Tuple](../../../sql-reference/data-types/tuple.md)を使用した例:

```response
┌─x─┬─s───────┐
│ 1 │ (1,'Z') │
│ 2 │ (1,'z') │
│ 3 │ (1,'a') │
│ 4 │ (2,'z') │
│ 5 │ (1,'A') │
│ 6 │ (2,'Z') │
│ 7 │ (2,'A') │
└───┴─────────┘
```

クエリ:

```sql
SELECT * FROM collate_test ORDER BY s ASC COLLATE 'en';
```

結果:

```response
┌─x─┬─s───────┐
│ 3 │ (1,'a') │
│ 5 │ (1,'A') │
│ 2 │ (1,'z') │
│ 1 │ (1,'Z') │
│ 7 │ (2,'A') │
│ 4 │ (2,'z') │
│ 6 │ (2,'Z') │
└───┴─────────┘
```

## 実装の詳細 {#implementation-details}

`ORDER BY`に加えて小さな[LIMIT](../../../sql-reference/statements/select/limit.md)が指定されると、より少ないRAMが使用されます。そうでない場合、使用されるメモリの量はソートするデータのボリュームに比例します。分散クエリ処理の場合、[GROUP BY](/sql-reference/statements/select/group-by)が省略されると、リモートサーバーで部分的にソートされ、リクエスターサーバーで結果がマージされます。これは、分散ソートの場合、ソートするデータのボリュームが単一サーバーのメモリ量を超える可能性があることを意味します。

RAMが不足している場合、外部メモリ（ディスク上に一時ファイルを作成）でソートを実行することができます。この目的のために設定 `max_bytes_before_external_sort` を使用します。これが0に設定されている場合（デフォルト）、外部ソートは無効になります。有効な場合、ソートするデータのボリュームが指定されたバイト数に達すると、収集したデータがソートされ、一時ファイルにダンプされます。全てのデータが読み取られた後、すべてのソートされたファイルがマージされ、結果が出力されます。ファイルは、構成内の `/var/lib/clickhouse/tmp/` ディレクトリに書き込まれます（デフォルトであり、`tmp_path`パラメータを使用してこの設定を変更できます）。

クエリを実行すると、`max_bytes_before_external_sort` よりも多くのメモリを使用する可能性があります。このため、この設定は `max_memory_usage` よりもかなり小さい値である必要があります。例えば、サーバーが128GBのRAMを持っていて、単一のクエリを実行する必要がある場合、`max_memory_usage`を100GBに設定し、`max_bytes_before_external_sort`を80GBに設定します。

外部ソートはRAM内でのソートよりもはるかに効率が悪いです。

## データ読み取りの最適化 {#optimization-of-data-reading}

`ORDER BY`式がテーブルソートキーと一致する接頭辞を持っている場合、[optimize_read_in_order](../../../operations/settings/settings.md#optimize_read_in_order)設定を使用してクエリを最適化できます。

`optimize_read_in_order`設定が有効な場合、ClickHouseサーバーはテーブルインデックスを使用し、`ORDER BY`キーの順番でデータを読み取ります。これにより、指定された[LIMIT](../../../sql-reference/statements/select/limit.md)の場合、すべてのデータを読み取ることを回避できます。そのため、大きなデータに対する小さいリミットのクエリは高速で処理されます。

最適化は`ASC`と`DESC`の両方で機能し、[GROUP BY](/sql-reference/statements/select/group-by)句および[FINAL](../../../sql-reference/statements/select/from.md#select-from-final)修飾子とは同時には機能しません。

`optimize_read_in_order`設定が無効な場合、ClickHouseサーバーは`SELECT`クエリの処理中にテーブルインデックスを使用しません。

`ORDER BY`句があり、大きな`LIMIT`と、クエリ対象のデータが見つかる前に大量のレコードを読み込む必要がある[WHERE](../../../sql-reference/statements/select/where.md)条件を持つクエリを実行する場合、`optimize_read_in_order`を手動で無効にすることを検討してください。

最適化は以下のテーブルエンジンでサポートされています：

- [MergeTree](../../../engines/table-engines/mergetree-family/mergetree.md)（[マテリアライズドビュー](../../../sql-reference/statements/create/view.md#materialized-view)を含む）、 
- [Merge](../../../engines/table-engines/special/merge.md)、 
- [Buffer](../../../engines/table-engines/special/buffer.md)

`MaterializedView`エンジンのテーブルでは、最適化は `SELECT ... FROM merge_tree_table ORDER BY pk` といったビューで機能します。しかし、`SELECT ... FROM view ORDER BY pk`のようなクエリでは、ビュークエリに`ORDER BY`句がない場合はサポートされません。

## ORDER BY Expr WITH FILL 修飾子 {#order-by-expr-with-fill-modifier}

この修飾子は、[LIMIT ... WITH TIES 修飾子](../../../sql-reference/statements/select/limit.md#limit-with-ties)と組み合わせることもできます。

`WITH FILL`修飾子は、`ORDER BY expr`の後、オプションの`FROM expr`、`TO expr`、`STEP expr`パラメータを設定できます。
`expr`カラムの欠落した値は順次埋められ、他のカラムはデフォルト値で埋められます。

複数のカラムを埋めるには、`ORDER BY`セクションの各フィールド名の後に、オプションのパラメータを持つ`WITH FILL`修飾子を追加します。

``` sql
ORDER BY expr [WITH FILL] [FROM const_expr] [TO const_expr] [STEP const_numeric_expr] [STALENESS const_numeric_expr], ... exprN [WITH FILL] [FROM expr] [TO expr] [STEP numeric_expr] [STALENESS numeric_expr]
[INTERPOLATE [(col [AS expr], ... colN [AS exprN])]]
```

`WITH FILL`はNumeric（すべての種類のfloat、decimal、int）またはDate/DateTime型のフィールドに適用できます。`String`フィールドに適用される場合、欠落した値は空の文字列で埋められます。
`FROM const_expr`が定義されていない場合、埋めの順序は`ORDER BY`の最小`expr`フィールド値を使用します。
`TO const_expr`が定義されていない場合、埋めの順序は`ORDER BY`の最大`expr`フィールド値を使用します。
`STEP const_numeric_expr`が定義されている場合、`const_numeric_expr`は数値型に対してはそのまま解釈され、Date型では`days`、DateTime型では`seconds`として解釈されます。また、時間と日付の間隔を表す[INTERVAL](/sql-reference/data-types/special-data-types/interval/)データ型もサポートしています。
`STEP const_numeric_expr`が省略された場合、埋めの順序には数値型に対しては`1.0`、Date型に対しては`1 day`、DateTime型に対しては`1 second`が使用されます。
`STALENESS const_numeric_expr`が定義されている場合、クエリは、元のデータの前の行との差が`const_numeric_expr`を超えるまで行を生成します。
`INTERPOLATE`は`ORDER BY WITH FILL`に参加しないカラムに適用できます。そのようなカラムは、前のフィールドの値に基づいて`expr`を適用して埋められます。`expr`が存在しない場合は前の値を繰り返します。省略されたリストは、許可されたすべてのカラムを含む結果になります。

`WITH FILL`なしのクエリの例:

``` sql
SELECT n, source FROM (
   SELECT toFloat32(number % 10) AS n, 'original' AS source
   FROM numbers(10) WHERE number % 3 = 1
) ORDER BY n;
```

結果:

``` text
┌─n─┬─source───┐
│ 1 │ original │
│ 4 │ original │
│ 7 │ original │
└───┴──────────┘
```

`WITH FILL`修飾子を適用した後の同じクエリ:

``` sql
SELECT n, source FROM (
   SELECT toFloat32(number % 10) AS n, 'original' AS source
   FROM numbers(10) WHERE number % 3 = 1
) ORDER BY n WITH FILL FROM 0 TO 5.51 STEP 0.5;
```

結果:

``` text
┌───n─┬─source───┐
│   0 │          │
│ 0.5 │          │
│   1 │ original │
│ 1.5 │          │
│   2 │          │
│ 2.5 │          │
│   3 │          │
│ 3.5 │          │
│   4 │ original │
│ 4.5 │          │
│   5 │          │
│ 5.5 │          │
│   7 │ original │
└─────┴──────────┘
```

複数フィールドのケースの `ORDER BY field2 WITH FILL, field1 WITH FILL` では、埋めの順序は `ORDER BY`句内のフィールドの順序に従います。

例:

``` sql
SELECT
    toDate((number * 10) * 86400) AS d1,
    toDate(number * 86400) AS d2,
    'original' AS source
FROM numbers(10)
WHERE (number % 3) = 1
ORDER BY
    d2 WITH FILL,
    d1 WITH FILL STEP 5;
```

結果:

``` text
┌───d1───────┬───d2───────┬─source───┐
│ 1970-01-11 │ 1970-01-02 │ original │
│ 1970-01-01 │ 1970-01-03 │          │
│ 1970-01-01 │ 1970-01-04 │          │
│ 1970-02-10 │ 1970-01-05 │ original │
│ 1970-01-01 │ 1970-01-06 │          │
│ 1970-01-01 │ 1970-01-07 │          │
│ 1970-03-12 │ 1970-01-08 │ original │
└────────────┴────────────┴──────────┘
```

フィールド `d1` は埋められず、デフォルト値を使用します。なぜなら、`d2` 値の繰り返し値がないため、`d1` の順序を正しく計算できないからです。

`ORDER BY`に変更されたフィールドを含む次のクエリ:

``` sql
SELECT
    toDate((number * 10) * 86400) AS d1,
    toDate(number * 86400) AS d2,
    'original' AS source
FROM numbers(10)
WHERE (number % 3) = 1
ORDER BY
    d1 WITH FILL STEP 5,
    d2 WITH FILL;
```

結果:

``` text
┌───d1───────┬───d2───────┬─source───┐
│ 1970-01-11 │ 1970-01-02 │ original │
│ 1970-01-16 │ 1970-01-01 │          │
│ 1970-01-21 │ 1970-01-01 │          │
│ 1970-01-26 │ 1970-01-01 │          │
│ 1970-01-31 │ 1970-01-01 │          │
│ 1970-02-05 │ 1970-01-01 │          │
│ 1970-02-10 │ 1970-01-05 │ original │
│ 1970-02-15 │ 1970-01-01 │          │
│ 1970-02-20 │ 1970-01-01 │          │
│ 1970-02-25 │ 1970-01-01 │          │
│ 1970-03-02 │ 1970-01-01 │          │
│ 1970-03-07 │ 1970-01-01 │          │
│ 1970-03-12 │ 1970-01-08 │ original │
└────────────┴────────────┴──────────┘
```

以下のクエリでは、`d1`列の各データを埋めるために、`INTERVAL`データ型の1日を使用します:

``` sql
SELECT
    toDate((number * 10) * 86400) AS d1,
    toDate(number * 86400) AS d2,
    'original' AS source
FROM numbers(10)
WHERE (number % 3) = 1
ORDER BY
    d1 WITH FILL STEP INTERVAL 1 DAY,
    d2 WITH FILL;
```

結果:
```response
┌─────────d1─┬─────────d2─┬─source───┐
│ 1970-01-11 │ 1970-01-02 │ original │
│ 1970-01-12 │ 1970-01-01 │          │
│ 1970-01-13 │ 1970-01-01 │          │
│ 1970-01-14 │ 1970-01-01 │          │
│ 1970-01-15 │ 1970-01-01 │          │
│ 1970-01-16 │ 1970-01-01 │          │
│ 1970-01-17 │ 1970-01-01 │          │
│ 1970-01-18 │ 1970-01-01 │          │
│ 1970-01-19 │ 1970-01-01 │          │
│ 1970-01-20 │ 1970-01-01 │          │
│ 1970-01-21 │ 1970-01-01 │          │
│ 1970-01-22 │ 1970-01-01 │          │
│ 1970-01-23 │ 1970-01-01 │          │
│ 1970-01-24 │ 1970-01-01 │          │
│ 1970-01-25 │ 1970-01-01 │          │
│ 1970-01-26 │ 1970-01-01 │          │
│ 1970-01-27 │ 1970-01-01 │          │
│ 1970-01-28 │ 1970-01-01 │          │
│ 1970-01-29 │ 1970-01-01 │          │
│ 1970-01-30 │ 1970-01-01 │          │
│ 1970-01-31 │ 1970-01-01 │          │
│ 1970-02-01 │ 1970-01-01 │          │
│ 1970-02-02 │ 1970-01-01 │          │
│ 1970-02-03 │ 1970-01-01 │          │
│ 1970-02-04 │ 1970-01-01 │          │
│ 1970-02-05 │ 1970-01-01 │          │
│ 1970-02-06 │ 1970-01-01 │          │
│ 1970-02-07 │ 1970-01-01 │          │
│ 1970-02-08 │ 1970-01-01 │          │
│ 1970-02-09 │ 1970-01-01 │          │
│ 1970-02-10 │ 1970-01-05 │ original │
│ 1970-02-11 │ 1970-01-01 │          │
│ 1970-02-12 │ 1970-01-01 │          │
│ 1970-02-13 │ 1970-01-01 │          │
│ 1970-02-14 │ 1970-01-01 │          │
│ 1970-02-15 │ 1970-01-01 │          │
│ 1970-02-16 │ 1970-01-01 │          │
│ 1970-02-17 │ 1970-01-01 │          │
│ 1970-02-18 │ 1970-01-01 │          │
│ 1970-02-19 │ 1970-01-01 │          │
│ 1970-02-20 │ 1970-01-01 │          │
│ 1970-02-21 │ 1970-01-01 │          │
│ 1970-02-22 │ 1970-01-01 │          │
│ 1970-02-23 │ 1970-01-01 │          │
│ 1970-02-24 │ 1970-01-01 │          │
│ 1970-02-25 │ 1970-01-01 │          │
│ 1970-02-26 │ 1970-01-01 │          │
│ 1970-02-27 │ 1970-01-01 │          │
│ 1970-02-28 │ 1970-01-01 │          │
│ 1970-03-01 │ 1970-01-01 │          │
│ 1970-03-02 │ 1970-01-01 │          │
│ 1970-03-03 │ 1970-01-01 │          │
│ 1970-03-04 │ 1970-01-01 │          │
│ 1970-03-05 │ 1970-01-01 │          │
│ 1970-03-06 │ 1970-01-01 │          │
│ 1970-03-07 │ 1970-01-01 │          │
│ 1970-03-08 │ 1970-01-01 │          │
│ 1970-03-09 │ 1970-01-01 │          │
│ 1970-03-10 │ 1970-01-01 │          │
│ 1970-03-11 │ 1970-01-01 │          │
│ 1970-03-12 │ 1970-01-08 │ original │
└────────────┴────────────┴──────────┘
```

`STALENESS`なしのクエリの例:

``` sql
SELECT number as key, 5 * number value, 'original' AS source
FROM numbers(16) WHERE key % 5 == 0
ORDER BY key WITH FILL;
```

結果:

``` text
    ┌─key─┬─value─┬─source───┐
 1. │   0 │     0 │ original │
 2. │   1 │     0 │          │
 3. │   2 │     0 │          │
 4. │   3 │     0 │          │
 5. │   4 │     0 │          │
 6. │   5 │    25 │ original │
 7. │   6 │     0 │          │
 8. │   7 │     0 │          │
 9. │   8 │     0 │          │
10. │   9 │     0 │          │
11. │  10 │    50 │ original │
12. │  11 │     0 │          │
13. │  12 │     0 │          │
14. │  13 │     0 │          │
15. │  14 │     0 │          │
16. │  15 │    75 │ original │
    └─────┴───────┴──────────┘
```

`STALENESS 3`を適用した後の同じクエリ:

``` sql
SELECT number as key, 5 * number value, 'original' AS source
FROM numbers(16) WHERE key % 5 == 0
ORDER BY key WITH FILL STALENESS 3;
```

結果:

``` text
    ┌─key─┬─value─┬─source───┐
 1. │   0 │     0 │ original │
 2. │   1 │     0 │          │
 3. │   2 │     0 │          │
 4. │   5 │    25 │ original │
 5. │   6 │     0 │          │
 6. │   7 │     0 │          │
 7. │  10 │    50 │ original │
 8. │  11 │     0 │          │
 9. │  12 │     0 │          │
10. │  15 │    75 │ original │
11. │  16 │     0 │          │
12. │  17 │     0 │          │
    └─────┴───────┴──────────┘
```

`INTERPOLATE`なしのクエリの例:

``` sql
SELECT n, source, inter FROM (
   SELECT toFloat32(number % 10) AS n, 'original' AS source, number as inter
   FROM numbers(10) WHERE number % 3 = 1
) ORDER BY n WITH FILL FROM 0 TO 5.51 STEP 0.5;
```

結果:

``` text
┌───n─┬─source───┬─inter─┐
│   0 │          │     0 │
│ 0.5 │          │     0 │
│   1 │ original │     1 │
│ 1.5 │          │     0 │
│   2 │          │     0 │
│ 2.5 │          │     0 │
│   3 │          │     0 │
│ 3.5 │          │     0 │
│   4 │ original │     4 │
│ 4.5 │          │     0 │
│   5 │          │     0 │
│ 5.5 │          │     0 │
│   7 │ original │     7 │
└─────┴──────────┴───────┘
```

`INTERPOLATE`を適用した後の同じクエリ:

``` sql
SELECT n, source, inter FROM (
   SELECT toFloat32(number % 10) AS n, 'original' AS source, number as inter
   FROM numbers(10) WHERE number % 3 = 1
) ORDER BY n WITH FILL FROM 0 TO 5.51 STEP 0.5 INTERPOLATE (inter AS inter + 1);
```

結果:

``` text
┌───n─┬─source───┬─inter─┐
│   0 │          │     0 │
│ 0.5 │          │     0 │
│   1 │ original │     1 │
│ 1.5 │          │     2 │
│   2 │          │     3 │
│ 2.5 │          │     4 │
│   3 │          │     5 │
│ 3.5 │          │     6 │
│   4 │ original │     4 │
│ 4.5 │          │     5 │
│   5 │          │     6 │
│ 5.5 │          │     7 │
│   7 │ original │     7 │
└─────┴──────────┴───────┘
```

## ソート接頭辞によるグループ化での埋め込み {#filling-grouped-by-sorting-prefix}

特定のカラムで同じ値を持つ行を独立して埋めるのは便利です。良い例は、時系列に欠落した値を埋めることです。
次のような時系列テーブルを考えてみましょう:
``` sql
CREATE TABLE timeseries
(
    `sensor_id` UInt64,
    `timestamp` DateTime64(3, 'UTC'),
    `value` Float64
)
ENGINE = Memory;

SELECT * FROM timeseries;

┌─sensor_id─┬───────────────timestamp─┬─value─┐
│       234 │ 2021-12-01 00:00:03.000 │     3 │
│       432 │ 2021-12-01 00:00:01.000 │     1 │
│       234 │ 2021-12-01 00:00:07.000 │     7 │
│       432 │ 2021-12-01 00:00:05.000 │     5 │
└───────────┴─────────────────────────┴───────┘
```
各センサーについて独立して欠落した値を1秒間隔で埋めたいとします。
`timestamp`カラムを埋めるためのソート接頭辞として`sensor_id`カラムを使用することで実現できます:
```sql
SELECT *
FROM timeseries
ORDER BY
    sensor_id,
    timestamp WITH FILL
INTERPOLATE ( value AS 9999 )

┌─sensor_id─┬───────────────timestamp─┬─value─┐
│       234 │ 2021-12-01 00:00:03.000 │     3 │
│       234 │ 2021-12-01 00:00:04.000 │  9999 │
│       234 │ 2021-12-01 00:00:05.000 │  9999 │
│       234 │ 2021-12-01 00:00:06.000 │  9999 │
│       234 │ 2021-12-01 00:00:07.000 │     7 │
│       432 │ 2021-12-01 00:00:01.000 │     1 │
│       432 │ 2021-12-01 00:00:02.000 │  9999 │
│       432 │ 2021-12-01 00:00:03.000 │  9999 │
│       432 │ 2021-12-01 00:00:04.000 │  9999 │
│       432 │ 2021-12-01 00:00:05.000 │     5 │
└───────────┴─────────────────────────┴───────┘
```
ここで、埋められた行をより目立たせるために、`value`カラムは`9999`で補間されています。
この動作は、`use_with_fill_by_sorting_prefix`設定によって制御されます（デフォルトでは有効）。

## 関連コンテンツ {#related-content}

- ブログ: [ClickHouseでの時系列データの操作](https://clickhouse.com/blog/working-with-time-series-data-and-functions-ClickHouse)
