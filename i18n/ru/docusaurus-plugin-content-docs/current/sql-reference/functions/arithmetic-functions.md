---
slug: /sql-reference/functions/arithmetic-functions
sidebar_position: 5
sidebar_label: Арифметические функции
---


# Арифметические функции

Арифметические функции работают с любыми двумя операндами типов `UInt8`, `UInt16`, `UInt32`, `UInt64`, `Int8`, `Int16`, `Int32`, `Int64`, `Float32` или `Float64`.

Перед выполнением операции оба операнда приводятся к типу результата. Тип результата определяется следующим образом (если в документации функции ниже не указано иное):
- Если оба операнда имеют размер до 32 бит, размер типа результата будет равен размеру следующего большего типа, следуя большему из двух операндов (продвижение целочисленного размера). Например, `UInt8 + UInt16 = UInt32` или `Float32 * Float32 = Float64`.
- Если один из операндов имеет 64 бита или более, размер типа результата будет равен размеру большего из двух операндов. Например, `UInt32 + UInt128 = UInt128` или `Float32 * Float64 = Float64`.
- Если один из операндов знаковый, то тип результата также будет знаковым, иначе он будет беззнаковым. Например, `UInt32 * Int32 = Int64`.

Эти правила гарантируют, что тип результата будет наименьшим типом, который может представить все возможные результаты. Хотя это создает риск переполнений вокруг границы диапазона значений, это обеспечивает быстрые вычисления с использованием максимальной ширины нативного целого числа в 64 бита. Это поведение также гарантирует совместимость со многими другими базами данных, которые предоставляют 64-битные целые числа (BIGINT) в качестве самого большого целочисленного типа.

Пример:

```sql
SELECT toTypeName(0), toTypeName(0 + 0), toTypeName(0 + 0 + 0), toTypeName(0 + 0 + 0 + 0)
```

```text
┌─toTypeName(0)─┬─toTypeName(plus(0, 0))─┬─toTypeName(plus(plus(0, 0), 0))─┬─toTypeName(plus(plus(plus(0, 0), 0), 0))─┐
│ UInt8         │ UInt16                 │ UInt32                          │ UInt64                                   │
└───────────────┴────────────────────────┴─────────────────────────────────┴──────────────────────────────────────────┘
```

Переполнения происходят так же, как в C++.

## plus {#plus}

Вычисляет сумму двух значений `a` и `b`.

**Синтаксис**

```sql
plus(a, b)
```

Возможно сложение целого числа и даты или даты с временем. Первое действие увеличивает количество дней в дате, второе действие увеличивает количество секунд в дате с временем.

Псевдоним: `a + b` (оператор)

## minus {#minus}

Вычисляет разность двух значений `a` и `b`. Результат всегда знаковый.

Как и в случае с `plus`, можно вычитать целое число из даты или даты с временем.

Кроме того, поддерживается вычитание между датами с временем, результатом является разница во времени между ними.

**Синтаксис**

```sql
minus(a, b)
```

Псевдоним: `a - b` (оператор)

## multiply {#multiply}

Вычисляет произведение двух значений `a` и `b`.

**Синтаксис**

```sql
multiply(a, b)
```

Псевдоним: `a * b` (оператор)

## divide {#divide}

Вычисляет частное двух значений `a` и `b`. Тип результата всегда [Float64](../data-types/float.md). Целочисленное деление выполняется с помощью функции `intDiv`.

Деление на 0 возвращает `inf`, `-inf` или `nan`.

**Синтаксис**

```sql
divide(a, b)
```

Псевдоним: `a / b` (оператор)

## intDiv {#intdiv}

Выполняет целочисленное деление двух значений `a` на `b`, т.е. вычисляет частное, округленное вниз до следующего меньшего целого.

Результат имеет такую же ширину, как и делимое (первый параметр).

Исключение выбрасывается при делении на ноль, если частное не помещается в диапазон делимого или при делении минимального отрицательного числа на минус один.

**Синтаксис**

```sql
intDiv(a, b)
```

**Пример**

Запрос:

```sql
SELECT
    intDiv(toFloat64(1), 0.001) AS res,
    toTypeName(res)
```

```response
┌──res─┬─toTypeName(intDiv(toFloat64(1), 0.001))─┐
│ 1000 │ Int64                                   │
└──────┴─────────────────────────────────────────┘
```

```sql
SELECT
    intDiv(1, 0.001) AS res,
    toTypeName(res)
```

```response
Received exception from server (version 23.2.1):
Code: 153. DB::Exception: Received from localhost:9000. DB::Exception: Cannot perform integer division, because it will produce infinite or too large number: While processing intDiv(1, 0.001) AS res, toTypeName(res). (ILLEGAL_DIVISION)
```

## intDivOrZero {#intdivorzero}

То же самое, что и `intDiv`, но возвращает ноль при делении на ноль или при делении минимального отрицательного числа на минус один.

**Синтаксис**

```sql
intDivOrZero(a, b)
```

## isFinite {#isfinite}

Возвращает 1, если аргумент Float32 или Float64 конечный и не NaN, в противном случае эта функция возвращает 0.

**Синтаксис**

```sql
isFinite(x)
```

## isInfinite {#isinfinite}

Возвращает 1, если аргумент Float32 или Float64 бесконечный, в противном случае эта функция возвращает 0. Обратите внимание, что 0 возвращается для NaN.

**Синтаксис**

```sql
isInfinite(x)
```

## ifNotFinite {#ifnotfinite}

Проверяет, является ли значение с плавающей запятой конечным.

**Синтаксис**

```sql
ifNotFinite(x,y)
```

**Аргументы**

- `x` — Значение для проверки на бесконечность. [Float\*](../data-types/float.md).
- `y` — Резервное значение. [Float\*](../data-types/float.md).

**Возвращаемое значение**

- `x`, если `x` конечный.
- `y`, если `x` не конечный.

**Пример**

Запрос:

    SELECT 1/0 as infimum, ifNotFinite(infimum,42)

Результат:

    ┌─infimum─┬─ifNotFinite(divide(1, 0), 42)─┐
    │     inf │                            42 │
    └─────────┴───────────────────────────────┘

Вы также можете получить аналогичный результат, используя [тернарный оператор](/sql-reference/functions/conditional-functions#if): `isFinite(x) ? x : y`.

## isNaN {#isnan}

Возвращает 1, если аргумент Float32 и Float64 является NaN, в противном случае эта функция возвращает 0.

**Синтаксис**

```sql
isNaN(x)
```

## modulo {#modulo}

Вычисляет остаток от деления двух значений `a` на `b`.

Тип результата является целым, если оба входные значения целые. Если одно из входных значений является числом с плавающей запятой, тип результата — [Float64](../data-types/float.md).

Остаток вычисляется так же, как в C++. Для отрицательных чисел используется усеченное деление.

Исключение выбрасывается при делении на ноль или при делении минимального отрицательного числа на минус один.

**Синтаксис**

```sql
modulo(a, b)
```

Псевдоним: `a % b` (оператор)

## moduloOrZero {#moduloorzero}

Как [modulo](#modulo), но возвращает ноль, когда делитель равен нулю.

**Синтаксис**

```sql
moduloOrZero(a, b)
```

## positiveModulo(a, b) {#positivemoduloa-b}

Как [modulo](#modulo), но всегда возвращает неотрицательное число.

Эта функция работает на 4-5 раз медленнее, чем `modulo`.

**Синтаксис**

```sql
positiveModulo(a, b)
```

Псевдонимы:
- `positive_modulo(a, b)`
- `pmod(a, b)`

**Пример**

Запрос:

```sql
SELECT positiveModulo(-1, 10)
```

Результат:

```result
┌─positiveModulo(-1, 10)─┐
│                      9 │
└────────────────────────┘
```

## negate {#negate}

Отрицает значение `a`. Результат всегда знаковый.

**Синтаксис**

```sql
negate(a)
```

Псевдоним: `-a`

## abs {#abs}

Вычисляет абсолютное значение `a`. Не оказывает эффекта, если `a` является беззнаковым типом. Если `a` является знаковым типом, возвращает беззнаковое число.

**Синтаксис**

```sql
abs(a)
```

## gcd {#gcd}

Возвращает наибольший общий делитель двух значений `a` и `b`.

Исключение выбрасывается при делении на ноль или при делении минимального отрицательного числа на минус один.

**Синтаксис**

```sql
gcd(a, b)
```

## lcm(a, b) {#lcma-b}

Возвращает наименьшее общее кратное двух значений `a` и `b`.

Исключение выбрасывается при делении на ноль или при делении минимального отрицательного числа на минус один.

**Синтаксис**

```sql
lcm(a, b)
```

## max2 {#max2}

Возвращает большее из двух значений `a` и `b`. Возвращаемое значение имеет тип [Float64](../data-types/float.md).

**Синтаксис**

```sql
max2(a, b)
```

**Пример**

Запрос:

```sql
SELECT max2(-1, 2);
```

Результат:

```result
┌─max2(-1, 2)─┐
│           2 │
└─────────────┘
```

## min2 {#min2}

Возвращает меньшее из двух значений `a` и `b`. Возвращаемое значение имеет тип [Float64](../data-types/float.md).

**Синтаксис**

```sql
min2(a, b)
```

**Пример**

Запрос:

```sql
SELECT min2(-1, 2);
```

Результат:

```result
┌─min2(-1, 2)─┐
│          -1 │
└─────────────┘
```

## multiplyDecimal {#multiplydecimal}

Умножает два десятичных числа `a` и `b`. Результат будет иметь тип [Decimal256](../data-types/decimal.md).

Масштаб результата может быть явно указан параметром `result_scale`. Если `result_scale` не указан, предполагается, что он равен максимальному масштабу входных значений.

Эта функция работает значительно медленнее, чем обычное `multiply`. Если нет контроля над точностью результата и/или требуется быстрая вычислительная скорость, рекомендуется использовать `multiply`.

**Синтаксис**

```sql
multiplyDecimal(a, b[, result_scale])
```

**Аргументы**

- `a` — Первое значение. [Decimal](../data-types/decimal.md).
- `b` — Второе значение. [Decimal](../data-types/decimal.md).
- `result_scale` — Масштаб результата. [Int/UInt](../data-types/int-uint.md).

**Возвращаемое значение**

- Результат умножения с заданным масштабом. [Decimal256](../data-types/decimal.md).

**Пример**

```result
┌─multiplyDecimal(toDecimal256(-12, 0), toDecimal32(-2.1, 1), 1)─┐
│                                                           25.2 │
└────────────────────────────────────────────────────────────────┘
```

**Отличия по сравнению с обычным умножением:**

```sql
SELECT toDecimal64(-12.647, 3) * toDecimal32(2.1239, 4);
SELECT toDecimal64(-12.647, 3) as a, toDecimal32(2.1239, 4) as b, multiplyDecimal(a, b);
```

Результат:

```result
┌─multiply(toDecimal64(-12.647, 3), toDecimal32(2.1239, 4))─┐
│                                               -26.8609633 │
└───────────────────────────────────────────────────────────┘
┌───────a─┬──────b─┬─multiplyDecimal(toDecimal64(-12.647, 3), toDecimal32(2.1239, 4))─┐
│ -12.647 │ 2.1239 │                                                         -26.8609 │
└─────────┴────────┴──────────────────────────────────────────────────────────────────┘
```

```sql
SELECT
    toDecimal64(-12.647987876, 9) AS a,
    toDecimal64(123.967645643, 9) AS b,
    multiplyDecimal(a, b);

SELECT
    toDecimal64(-12.647987876, 9) AS a,
    toDecimal64(123.967645643, 9) AS b,
    a * b;
```

Результат:

```result
┌─────────────a─┬─────────────b─┬─multiplyDecimal(toDecimal64(-12.647987876, 9), toDecimal64(123.967645643, 9))─┐
│ -12.647987876 │ 123.967645643 │                                                               -1567.941279108 │
└───────────────┴───────────────┴───────────────────────────────────────────────────────────────────────────────┘

Received exception from server (version 22.11.1):
Code: 407. DB::Exception: Received from localhost:9000. DB::Exception: Decimal math overflow: While processing toDecimal64(-12.647987876, 9) AS a, toDecimal64(123.967645643, 9) AS b, a * b. (DECIMAL_OVERFLOW)
```

## divideDecimal {#dividedecimal}

Делит два десятичных числа `a` и `b`. Результат будет иметь тип [Decimal256](../data-types/decimal.md).

Масштаб результата может быть явно указан параметром `result_scale`. Если `result_scale` не указан, предполагается, что он равен максимальному масштабу входных значений.

Эта функция работает значительно медленнее, чем обычное `divide`. Если нет контроля над точностью результата и/или требуется быстрая вычислительная скорость, рекомендуется использовать `divide`.

**Синтаксис**

```sql
divideDecimal(a, b[, result_scale])
```

**Аргументы**

- `a` — Первое значение: [Decimal](../data-types/decimal.md).
- `b` — Второе значение: [Decimal](../data-types/decimal.md).
- `result_scale` — Масштаб результата: [Int/UInt](../data-types/int-uint.md).

**Возвращаемое значение**

- Результат деления с заданным масштабом. [Decimal256](../data-types/decimal.md).

**Пример**

```result
┌─divideDecimal(toDecimal256(-12, 0), toDecimal32(2.1, 1), 10)─┐
│                                                -5.7142857142 │
└──────────────────────────────────────────────────────────────┘
```

**Отличия по сравнению с обычным делением:**

```sql
SELECT toDecimal64(-12, 1) / toDecimal32(2.1, 1);
SELECT toDecimal64(-12, 1) as a, toDecimal32(2.1, 1) as b, divideDecimal(a, b, 1), divideDecimal(a, b, 5);
```

Результат:

```result
┌─divide(toDecimal64(-12, 1), toDecimal32(2.1, 1))─┐
│                                             -5.7 │
└──────────────────────────────────────────────────┘

┌───a─┬───b─┬─divideDecimal(toDecimal64(-12, 1), toDecimal32(2.1, 1), 1)─┬─divideDecimal(toDecimal64(-12, 1), toDecimal32(2.1, 1), 5)─┐
│ -12 │ 2.1 │                                                       -5.7 │                                                   -5.71428 │
└─────┴─────┴────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘
```

```sql
SELECT toDecimal64(-12, 0) / toDecimal32(2.1, 1);
SELECT toDecimal64(-12, 0) as a, toDecimal32(2.1, 1) as b, divideDecimal(a, b, 1), divideDecimal(a, b, 5);
```

Результат:

```result
DB::Exception: Decimal result's scale is less than argument's one: While processing toDecimal64(-12, 0) / toDecimal32(2.1, 1). (ARGUMENT_OUT_OF_BOUND)

┌───a─┬───b─┬─divideDecimal(toDecimal64(-12, 0), toDecimal32(2.1, 1), 1)─┬─divideDecimal(toDecimal64(-12, 0), toDecimal32(2.1, 1), 5)─┐
│ -12 │ 2.1 │                                                       -5.7 │                                                   -5.71428 │
└─────┴─────┴────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘
```

## byteSwap {#byteswap}

Переворачивает байты целого числа, т.е. изменяет его [endianness](https://en.wikipedia.org/wiki/Endianness).

**Синтаксис**

```sql
byteSwap(a)
```

**Пример**

```sql
byteSwap(3351772109)
```

Результат:

```result
┌─byteSwap(3351772109)─┐
│           3455829959 │
└──────────────────────┘
```

Приведенный выше пример можно рассмотреть следующим образом:
1. Преобразовать целое число в десятичной системе счисления в эквивалентный шестнадцатеричный формат в формате большого порядка, т.е. 3351772109 -> C7 C7 FB CD (4 байта)
2. Перевернуть байты, т.е. C7 C7 FB CD -> CD FB C7 C7
3. Преобразовать результат обратно в целое число, предполагая большой порядок, т.е. CD FB C7 C7 -> 3455829959

Одним из применений этой функции является реверсирование IPv4:

```result
┌─toIPv4(byteSwap(toUInt32(toIPv4('205.251.199.199'))))─┐
│ 199.199.251.205                                       │
└───────────────────────────────────────────────────────┘
```
