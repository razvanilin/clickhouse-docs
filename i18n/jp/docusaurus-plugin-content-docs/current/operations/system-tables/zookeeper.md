---
description: "ClickHouse KeeperまたはZooKeeperが設定されている場合にのみ存在するシステムテーブルです。設定で定義されたKeeperクラスターからデータを公開します。"
slug: /operations/system-tables/zookeeper
title: "system.zookeeper"
keywords: ["system table", "zookeeper"]
---

このテーブルは、ClickHouse KeeperまたはZooKeeperが設定されている場合にのみ存在します。 `system.zookeeper` テーブルは、設定で定義されたKeeperクラスターからデータを公開します。クエリには、'path =' 条件または `path IN` 条件を `WHERE` 句とともに設定する必要があります。これは、データを取得したい子ノードのパスに対応します。

クエリ `SELECT * FROM system.zookeeper WHERE path = '/clickhouse'` は、 `/clickhouse` ノードのすべての子のデータを出力します。すべてのルートノードのデータを出力するには、`path = '/'` と記述します。'path' に指定されたパスが存在しない場合は、例外がスローされます。

クエリ `SELECT * FROM system.zookeeper WHERE path IN ('/', '/clickhouse')` は、 `/` および `/clickhouse` ノードのすべての子のデータを出力します。指定された 'path' コレクションに存在しないパスがある場合、例外がスローされます。これを使用して一括でKeeperパスクエリを実行できます。

カラム:

- `name` (String) — ノードの名前。
- `path` (String) — ノードへのパス。
- `value` (String) — ノードの値。
- `dataLength` (Int32) — 値のサイズ。
- `numChildren` (Int32) — 子孫の数。
- `czxid` (Int64) — ノードを作成したトランザクションのID。
- `mzxid` (Int64) — ノードを最後に変更したトランザクションのID。
- `pzxid` (Int64) — 最後に子孫を削除または追加したトランザクションのID。
- `ctime` (DateTime) — ノード作成時刻。
- `mtime` (DateTime) — ノードの最後の修正時刻。
- `version` (Int32) — ノードのバージョン：ノードが変更された回数。
- `cversion` (Int32) — 追加または削除された子孫の数。
- `aversion` (Int32) — ACLの変更回数。
- `ephemeralOwner` (Int64) — 一時ノードの場合、このノードを所有するセッションのID。

例:

``` sql
SELECT *
FROM system.zookeeper
WHERE path = '/clickhouse/tables/01-08/visits/replicas'
FORMAT Vertical
```

``` text
Row 1:
──────
name:           example01-08-1
value:
czxid:          932998691229
mzxid:          932998691229
ctime:          2015-03-27 16:49:51
mtime:          2015-03-27 16:49:51
version:        0
cversion:       47
aversion:       0
ephemeralOwner: 0
dataLength:     0
numChildren:    7
pzxid:          987021031383
path:           /clickhouse/tables/01-08/visits/replicas

Row 2:
──────
name:           example01-08-2
value:
czxid:          933002738135
mzxid:          933002738135
ctime:          2015-03-27 16:57:01
mtime:          2015-03-27 16:57:01
version:        0
cversion:       37
aversion:       0
ephemeralOwner: 0
dataLength:     0
numChildren:    7
pzxid:          987021252247
path:           /clickhouse/tables/01-08/visits/replicas
```
