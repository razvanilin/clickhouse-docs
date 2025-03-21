---
slug: /interfaces/third-party/gui
sidebar_position: 28
sidebar_label: Визуальные интерфейсы
---


# Визуальные интерфейсы от сторонних разработчиков

## Open-Source {#open-source}

### ch-ui {#ch-ui}

[ch-ui](https://github.com/caioricciuti/ch-ui) — это простое приложение интерфейса на React.js для баз данных ClickHouse, разработанное для выполнения запросов и визуализации данных. Созданное с использованием React и клиента ClickHouse для веб, оно предлагает стильный и удобный интерфейс для легкого взаимодействия с базами данных.

Особенности:

- Интеграция с ClickHouse: Легкое управление подключениями и выполнение запросов.
- Управление вкладками с адаптивным дизайном: Динамическое управление несколькими вкладками, такими как вкладки запросов и таблиц.
- Оптимизация производительности: Использует Indexed DB для эффективного кэширования и управления состоянием.
- Локальное хранение данных: Все данные хранятся локально в браузере, что гарантирует, что данные не отправляются в другое место.

### ChartDB {#chartdb}

[ChartDB](https://chartdb.io) — это бесплатный и открытый инструмент для визуализации и проектирования схем баз данных, включая ClickHouse, всего с помощью одного запроса. Созданный с использованием React, он предоставляет бесшовный и удобный интерфейс, не требуя учетных данных для базы данных или регистрации для начала работы.

Особенности:

- Визуализация схемы: Мгновенно импортируйте и визуализируйте вашу схему ClickHouse, включая ER-диаграммы с материализованными представлениями и стандартными представлениями, показывающими ссылки на таблицы.
- Экспорт DDL с поддержкой AI: Генерируйте DDL-скрипты без усилий для лучшего управления схемой и документации.
- Поддержка нескольких SQL диалектов: Совместимость с рядом SQL диалектов, что делает его универсальным для различных сред баз данных.
- Не требуется регистрация или учетные данные: Все функции доступны непосредственно в браузере, что делает использование плавным и безопасным.

[Исходный код ChartDB](https://github.com/chartdb/chartdb).

### Tabix {#tabix}

Веб-интерфейс для ClickHouse в проекте [Tabix](https://github.com/tabixio/tabix).

Особенности:

- Работает с ClickHouse прямо из браузера без необходимости установки дополнительного программного обеспечения.
- Редактор запросов с подсветкой синтаксиса.
- Автозаполнение команд.
- Инструменты для графического анализа выполнения запросов.
- Опции цветовой схемы.

[Документация Tabix](https://tabix.io/doc/).

### HouseOps {#houseops}

[HouseOps](https://github.com/HouseOps/HouseOps) — это интерфейс UI/IDE для OSX, Linux и Windows.

Особенности:

- Конструктор запросов с подсветкой синтаксиса. Просмотр ответа в виде таблицы или JSON.
- Экспорт результатов запросов в CSV или JSON.
- Список процессов с описаниями. Режим записи. Возможность остановки (`KILL`) процесса.
- Граф базы данных. Показывает все таблицы и их колонки с дополнительной информацией.
- Быстрый просмотр размера колонки.
- Конфигурация сервера.

Следующие функции планируются к разработке:

- Управление базой данных.
- Управление пользователями.
- Анализ данных в реальном времени.
- Мониторинг кластера.
- Управление кластером.
- Мониторинг реплицированных таблиц и таблиц Kafka.

### LightHouse {#lighthouse}

[LightHouse](https://github.com/VKCOM/lighthouse) — это легковесный веб-интерфейс для ClickHouse.

Особенности:

- Список таблиц с фильтрацией и метаданными.
- Предварительный просмотр таблиц с фильтрацией и сортировкой.
- Выполнение запросов только для чтения.

### Redash {#redash}

[Redash](https://github.com/getredash/redash) — это платформа для визуализации данных.

Поддерживает несколько источников данных, включая ClickHouse. Redash может объединить результаты запросов из различных источников данных в один конечный набор данных.

Особенности:

- Мощный редактор запросов.
- Обозреватель баз данных.
- Инструмент визуализации, который позволяет представлять данные в различных формах.

### Grafana {#grafana}

[Grafana](https://grafana.com/grafana/plugins/grafana-clickhouse-datasource/) — это платформа для мониторинга и визуализации.

"Grafana позволяет вам запрашивать, визуализировать, уведомлять и понимать ваши метрики, независимо от того, где они хранятся. Создавайте, изучайте и делитесь панелями с вашей командой и развивайте культуру, ориентированную на данные." — grafana.com.

Плагин источника данных ClickHouse предоставляет поддержку ClickHouse как базовой базы данных.

### qryn {#qryn}

[qryn](https://metrico.in) — это полиглот, высокопроизводимый стек наблюдаемости для ClickHouse _(раньше cLoki)_, с нативной интеграцией Grafana, позволяющий пользователям загружать и анализировать логи, метрики и телеметрические трассировки от любого агента, поддерживающего Loki/LogQL, Prometheus/PromQL, OTLP/Tempo, Elastic, InfluxDB и многие другие.

Особенности:

- Встроенный интерфейс Explore UI и LogQL CLI для запроса, извлечения и визуализации данных.
- Поддержка нативных API Grafana для запросов, обработки, загрузки, трассировки и уведомлений без плагинов.
- Мощный поток для динамического поиска, фильтрации и извлечения данных из логов, событий, трассировок и других источников.
- API для загрузки и PUSH, прозрачная совместимость с LogQL, PromQL, InfluxDB, Elastic и многими другими.
- Готов к использованию с агентами, такими как Promtail, Grafana-Agent, Vector, Logstash, Telegraf и многими другими.

### DBeaver {#dbeaver}

[DBeaver](https://dbeaver.io/) — универсальный клиент для настольных баз данных с поддержкой ClickHouse.

Особенности:

- Разработка запросов с подсветкой синтаксиса и автозаполнением.
- Список таблиц с фильтрами и поиском метаданных.
- Предварительный просмотр данных таблицы.
- Поиск по всему тексту.

По умолчанию DBeaver не подключается сессиями (например, CLI подключается). Если вам требуется поддержка сессий (например, для настройки параметров для вашей сессии), отредактируйте параметры подключения драйвера и установите `session_id` на случайную строку (он использует http-подключение под капотом). После этого вы можете использовать любые настройки из окна запроса.

### clickhouse-cli {#clickhouse-cli}

[clickhouse-cli](https://github.com/hatarist/clickhouse-cli) — это альтернативный клиент командной строки для ClickHouse, написанный на Python 3.

Особенности:

- Автозаполнение.
- Подсветка синтаксиса для запросов и вывода данных.
- Поддержка постраничного вывода данных.
- Пользовательские команды, подобные PostgreSQL.

### clickhouse-flamegraph {#clickhouse-flamegraph}

[clickhouse-flamegraph](https://github.com/Slach/clickhouse-flamegraph) — это специализированный инструмент для визуализации `system.trace_log` в виде [flamegraph](http://www.brendangregg.com/flamegraphs.html).

### clickhouse-plantuml {#clickhouse-plantuml}

[cickhouse-plantuml](https://pypi.org/project/clickhouse-plantuml/) — это скрипт для генерации диаграммы [PlantUML](https://plantuml.com/) схем таблиц.

### xeus-clickhouse {#xeus-clickhouse}

[xeus-clickhouse](https://github.com/wangfenjin/xeus-clickhouse) — это ядро Jupyter для ClickHouse, которое поддерживает запросы данных CH с использованием SQL в Jupyter.

### MindsDB Studio {#mindsdb}

[MindsDB](https://mindsdb.com/) — это открытый слой AI для баз данных, включая ClickHouse, который позволяет вам легко разрабатывать, обучать и внедрять современные модели машинного обучения. MindsDB Studio (GUI) позволяет вам обучать новые модели из базы данных, интерпретировать предсказания, сделанные моделью, выявлять возможные предвзятости данных и оценивать и визуализировать точность модели с использованием функции объяснимого ИИ, чтобы быстрее адаптировать и настраивать ваши модели машинного обучения.

### DBM {#dbm}

[DBM](https://github.com/devlive-community/dbm) — это визуальный инструмент управления для ClickHouse!

Особенности:

- Поддержка истории запросов (пагинация, очистка всего и т. д.)
- Поддержка запроса выбранных SQL предложений
- Поддержка остановки запросов
- Поддержка управления таблицами (метаданные, удаление, предварительный просмотр)
- Поддержка управления базами данных (удаление, создание)
- Поддержка пользовательских запросов
- Поддержка управления несколькими источниками данных (тестирование подключения, мониторинг)
- Поддержка мониторинга (процессор, подключение, запрос)
- Поддержка миграции данных

### Bytebase {#bytebase}

[Bytebase](https://bytebase.com) — это веб-инструмент с открытым исходным кодом для изменения схем и контроля версий для команд. Он поддерживает различные базы данных, включая ClickHouse.

Особенности:

- Проверка схемы между разработчиками и DBA.
- Database-as-Code, контроль версий схемы в VCS, таком как GitLab, и триггер развертывания при коммите кода.
- Оптимизированное развертывание с политикой для каждой среды.
- Полная история миграции.
- Обнаружение изменений схемы.
- Резервное копирование и восстановление.
- RBAC.

### Zeppelin-Interpreter-for-ClickHouse {#zeppelin-interpreter-for-clickhouse}

[Zeppelin-Interpreter-for-ClickHouse](https://github.com/SiderZhang/Zeppelin-Interpreter-for-ClickHouse) — это интерпретатор [Zeppelin](https://zeppelin.apache.org) для ClickHouse. По сравнению с интерпретатором JDBC он может обеспечить лучший контроль времени ожидания для долгих запросов.

### ClickCat {#clickcat}

[ClickCat](https://github.com/clickcat-project/ClickCat) — это удобный пользовательский интерфейс, который позволяет вам искать, исследовать и визуализировать данные ClickHouse.

Особенности:

- Онлайн SQL редактор, который может выполнять ваш SQL код без необходимости установки.
- Вы можете наблюдать все процессы и мутации. Для незавершенных процессов вы можете остановить их в интерфейсе.
- Метрики включают в себя анализ кластера, анализ данных и анализ запросов.

### ClickVisual {#clickvisual}

[ClickVisual](https://clickvisual.net/) — это легковесная открытая платформа для логических запросов, анализа и визуализации.

Особенности:

- Поддержка однокнопочного создания библиотек анализа логов.
- Поддержка управления конфигурацией сбора логов.
- Поддержка настройки пользовательских индексов.
- Поддержка конфигурации тревог.
- Поддержка настройки гранулярности прав доступа к библиотекам и таблицам.

### ClickHouse-Mate {#clickmate}

[ClickHouse-Mate](https://github.com/metrico/clickhouse-mate) — это клиент на Angular + пользовательский интерфейс для поиска и исследования данных в ClickHouse.

Особенности:

- Автозаполнение SQL-запросов ClickHouse.
- Быстрая навигация по дереву БД и таблиц.
- Продвинутый фильтр и сортировка результатов.
- Встроенная документация по SQL ClickHouse.
- Предустановленные запросы и история.
- 100% браузерная платформа, без сервера/бэкенда.

Клиент доступен для мгновенного использования через страницы GitHub: https://metrico.github.io/clickhouse-mate/

### Uptrace {#uptrace}

[Uptrace](https://github.com/uptrace/uptrace) — это инструмент APM, который предоставляет распределенное трассирование и метрики, управляемые OpenTelemetry и ClickHouse.

Особенности:

- [Распределенное трассирование OpenTelemetry](https://uptrace.dev/opentelemetry/distributed-tracing.html), метрики и логи.
- Уведомления по Email/Slack/PagerDuty с использованием AlertManager.
- Язык запросов, похожий на SQL, для агрегации спанов.
- Язык, похожий на Promql, для запросов метрик.
- Предварительно созданные дашборды метрик.
- Несколько пользователей/проектов через YAML конфигурацию.

### clickhouse-monitoring {#clickhouse-monitoring}

[clickhouse-monitoring](https://github.com/duyet/clickhouse-monitoring) — это простой дашборд на Next.js, который полагается на таблицы `system.*`, чтобы помочь мониторить и предоставить общий обзор вашего кластера ClickHouse.

Особенности:

- Монитор запросов: текущие запросы, история запросов, ресурсы запросов (память, прочитанные части, открытые файлы и т. д.), самые дорогие запросы, самые используемые таблицы или колонки и т. д.
- Мониторинг кластера: общее использование памяти/ЦП, распределенная очередь, глобальные настройки, настройки merge tree, метрики и др.
- Информация о таблицах и частях: размер, количество строк, сжатие, размер части и т. д., с детализацией на уровне колонок.
- Полезные инструменты: исследование данных Zookeeper, EXPLAIN запросов, остановка запросов и др.
- Визуализация метрик: использование запросов и ресурсов, количество слияний/мутаций, производительность слияния, производительность запросов и др.

### CKibana {#ckibana}

[CKibana](https://github.com/TongchengOpenSource/ckibana) — это легковесный сервис, который позволяет вам без усилий искать, исследовать и визуализировать данные ClickHouse, используя нативный интерфейс Kibana.

Особенности:

- Преобразует запросы диаграмм из нативного интерфейса Kibana в синтаксис запросов ClickHouse.
- Поддерживает продвинутые функции, такие как выборка и кеширование, для повышения производительности запросов.
- Минимизирует стоимость обучения для пользователей после миграции с ElasticSearch на ClickHouse.

## Commercial {#commercial}

### DataGrip {#datagrip}

[DataGrip](https://www.jetbrains.com/datagrip/) — это IDE для баз данных от JetBrains с выделенной поддержкой ClickHouse. Он также встроен в другие инструменты на основе IntelliJ: PyCharm, IntelliJ IDEA, GoLand, PhpStorm и другие.

Особенности:

- Очень быстрое автозаполнение кода.
- Подсветка синтаксиса ClickHouse.
- Поддержка функций, специфичных для ClickHouse, например, вложенные колонки, движки таблиц.
- Редактор данных.
- Рефакторинг.
- Поиск и навигация.

### Yandex DataLens {#yandex-datalens}

[Yandex DataLens](https://cloud.yandex.ru/services/datalens) — это сервис визуализации и аналитики данных.

Особенности:

- Широкий спектр доступных визуализаций, от простых столбчатых диаграмм до сложных дашбордов.
- Дашборды могут быть общедоступными.
- Поддержка нескольких источников данных, включая ClickHouse.
- Хранение материализованных данных на основе ClickHouse.

DataLens доступен [бесплатно](https://cloud.yandex.com/docs/datalens/pricing) для проектов с низкой нагрузкой, даже для коммерческого использования.

- [Документация DataLens](https://cloud.yandex.com/docs/datalens/).
- [Учебное пособие](https://cloud.yandex.com/docs/solutions/datalens/data-from-ch-visualization) по визуализации данных из базы данных ClickHouse.

### Holistics Software {#holistics-software}

[Holistics](https://www.holistics.io/) — это платформа полного стека данных и инструмент бизнес-аналитики.

Особенности:

- Автоматически запланированные отчеты по email, Slack и Google Sheets.
- SQL-редактор с визуализациями, контролем версий, автозаполнением, компонентами запросов, которые можно повторно использовать, и динамическими фильтрами.
- Встраиваемая аналитика отчетов и дашбордов через iframe.
- Возможности подготовки данных и ETL.
- Поддержка моделирования данных SQL для реляционного сопоставления данных.

### Looker {#looker}

[Looker](https://looker.com) — это платформа данных и инструмент бизнес-аналитики с поддержкой более 50 диалектов баз данных, включая ClickHouse. Looker доступен как SaaS платформа и для самостоятельного размещения. Пользователи могут использовать Looker через браузер для исследования данных, создания визуализаций и дашбордов, планирования отчетов и обмена своими инсайтами с коллегами. Looker предоставляет богатый набор инструментов для встраивания этих функций в другие приложения и API для интеграции данных с другими приложениями.

Особенности:

- Легкая и гибкая разработка с использованием LookML, языка, который поддерживает кураторское
  [Моделирование данных](https://looker.com/platform/data-modeling) для поддержки авторов отчётов и конечных пользователей.
- Мощная интеграция рабочего процесса через [Data Actions](https://looker.com/platform/actions) Looker.

[Как настроить ClickHouse в Looker.](https://docs.looker.com/setup-and-management/database-config/clickhouse)

### SeekTable {#seektable}

[SeekTable](https://www.seektable.com) — это инструмент BI самообслуживания для исследования данных и оперативной отчетности. Он доступен как в облачном сервисе, так и в версии для самостоятельного размещения. Отчеты из SeekTable можно встраивать в любое веб-приложение.

Особенности:

- Дружественный к пользователям конструктор отчетов.
- Мощные параметры отчетов для фильтрации SQL и настройки запрашиваемых конкретных отчетов.
- Возможность подключения к ClickHouse как через нативный TCP/IP конечный пункт, так и через HTTP(S) интерфейс (2 разных драйвера).
- Возможность использовать всю мощь SQL диалекта ClickHouse в определениях размеров/мер.
- [Web API](https://www.seektable.com/help/web-api-integration) для автоматической генерации отчетов.
- Поддерживает поток разработки отчетов с резервным копированием/восстановлением данных аккаунта; конфигурация моделей данных (кубов) / отчетов является читаемым XML и может храниться в системе контроля версий.

SeekTable [бесплатен](https://www.seektable.com/help/cloud-pricing) для личного/индивидуального использования.

[Как настроить подключение ClickHouse в SeekTable.](https://www.seektable.com/help/clickhouse-pivot-table)

### Chadmin {#chadmin}

[Chadmin](https://github.com/bun4uk/chadmin) — это простой интерфейс, где вы можете визуализировать ваши текущие выполняющиеся запросы на кластере ClickHouse и информацию о них, а также остановить их, если это необходимо.

### TABLUM.IO {#tablum_io}

[TABLUM.IO](https://tablum.io/) — это онлайн инструмент для запросов и аналитики для ETL и визуализации. Он позволяет подключаться к ClickHouse, запрашивать данные через многофункциональную SQL-консоль, а также загружать данные из статических файлов и сторонних сервисов. TABLUM.IO может визуализировать результаты данных в виде диаграмм и таблиц.

Особенности:
- ETL: загрузка данных из популярных баз данных, локальных и удаленных файлов, вызовов API.
- Многофункциональная SQL-консоль с подсветкой синтаксиса и визуальным конструктором запросов.
- Визуализация данных в виде диаграмм и таблиц.
- Материализация данных и подзапросы.
- Отчеты о данных через Slack, Telegram или email.
- Проводка данных через проприетарный API.
- Экспорт данных в форматах JSON, CSV, SQL, HTML.
- Веб-интерфейс.

TABLUM.IO можно запускать как самостоятельное решение (в виде образа докера) или в облаке.
Лицензия: [коммерческий](https://tablum.io/pricing) продукт с 3-месячным бесплатным периодом.

Попробуйте бесплатно [в облаке](https://tablum.io/try).
Узнайте больше о продукте на [TABLUM.IO](https://tablum.io/)

### CKMAN {#ckman}

[CKMAN](https://www.github.com/housepower/ckman) — это инструмент для управления и мониторинга кластеров ClickHouse!

Особенности:

- Быстрое и удобное автоматизированное развертывание кластеров через интерфейс браузера.
- Кластеры могут быть увеличены или уменьшены.
- Балансировка нагрузки данных кластера.
- Обновление кластера онлайн.
- Изменение конфигурации кластера на странице.
- Предоставляет мониторинг узлов кластера и мониторинг zookeeper.
- Мониторинг состояния таблиц и партиций, а также медленные SQL-заявки.
