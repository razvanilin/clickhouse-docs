---
title: Миграция с Rockset
slug: /migrations/rockset
description: Миграция с Rockset в ClickHouse
keywords: [миграция, миграция, переход, данные, etl, elt, Rockset]
---


# Миграция с Rockset

Rockset — это база данных для анализа в реальном времени, [приобретенная OpenAI в июне 2024 года](https://rockset.com/blog/openai-acquires-rockset/).
У пользователей есть время до 30 сентября 2024 года, 17:00 по времени PDT, чтобы [оградить себя от сервиса](https://docs.rockset.com/documentation/docs/faq).

Мы считаем, что ClickHouse Cloud предоставит отличную платформу для пользователей Rockset, и в этом руководстве мы рассмотрим некоторые вещи, которые нужно учесть при миграции с Rockset в ClickHouse.

Приступим!

## Непосредственная помощь {#immediate-assistance}

Если вам нужна немедленная помощь, пожалуйста, свяжитесь с нами, заполнив [эту форму](https://clickhouse.com/company/contact?loc=docs-rockest-migrations), и с вами свяжется человек! 

## ClickHouse против Rockset - Сравнение на высоком уровне {#clickhouse-vs-rockset---high-level-comparison}

Мы начнем с краткого обзора сильных сторон ClickHouse и возможных преимуществ по сравнению с Rockset.

ClickHouse сосредоточен на производительности в реальном времени и экономии средств благодаря подходу "сначала схема". 
Хотя полуструктурированные данные поддерживаются, наша философия заключается в том, что пользователи должны решать, как структурировать свои данные, чтобы максимизировать производительность и эффективность использования ресурсов. 
В результате подхода "сначала схема", как показали наши тесты, ClickHouse превосходит Rockset в масштабируемости, пропускной способности загрузки, производительности запросов и экономичности.

Что касается интеграции с другими системами данных, ClickHouse обладает [широкими возможностями](/integrations), которые превышают возможности Rockset.

Обе платформы предлагают облачный продукт и сопутствующие услуги поддержки.
В отличие от Rockset, ClickHouse также имеет продукт с открытым исходным кодом и сообщество.
Исходный код ClickHouse доступен по адресу [github.com/clickhouse/clickhouse](https://github.com/clickhouse/clickhouse), а на момент написания статьи в нем участвовало более 1500 разработчиков.
[ClickHouse Community Slack](https://clickhouse.com/slack) включает более 7000 участников, которые делятся своим опытом/лучшими практиками и помогают друг другу с любыми возникшими проблемами.

Это руководство по миграции сосредоточено на миграции из Rockset в ClickHouse Cloud, но пользователи могут ссылаться на [остальную часть нашей документации](/) о возможностях с открытым исходным кодом.

## Ключевые концепции Rockset {#rockset-key-concepts}

Давайте начнем с рассмотрения [ключевых концепций Rockset](https://docs.rockset.com/documentation/docs/key-concepts) и объясним их эквиваленты (где они существуют) в ClickHouse Cloud.

### Источники данных {#data-sources}

Rockset и ClickHouse обе поддерживают загрузку данных из разных источников. 

В Rockset вы создаете источник данных, а затем создаете _коллекцию_ на основе этого источника данных.
Существуют полностью управляемые интеграции для платформ потоковой передачи событий, OLTP баз данных и облачного хранилища.

В ClickHouse Cloud эквивалентом полностью управляемых интеграций являются [ClickPipes](/integrations/clickpipes).
ClickPipes поддерживает непрерывную загрузку данных из платформ потоковой передачи событий и облачного хранилища.
ClickPipes загружает данные в _таблицы_.

### Преобразования при загрузке {#ingest-transformations}

Преобразования при загрузке в Rockset позволяют вам преобразовывать необработанные данные, поступающие в Rockset, перед их сохранением в коллекцию.
ClickHouse Cloud делает то же самое через ClickPipes, который использует функцию [материализованных представлений](/guides/developer/cascading-materialized-views) ClickHouse для преобразования данных.

### Коллекции {#collections}

В Rockset вы запрашиваете коллекции. В ClickHouse Cloud вы запрашиваете таблицы.
В обеих службах запросы выполняются с использованием SQL.
ClickHouse добавляет дополнительные функции поверх стандартных функций SQL, чтобы дать вам больше возможностей для манипуляции и преобразования ваших данных.

### Лямбда-запросы {#query-lambdas}

Rockset поддерживает лямбда-запросы, именованные параметризованные запросы, хранящиеся в Rockset, которые могут выполняться с выделенной точки REST.
[API-методы запросов](/cloud/get-started/query-endpoints) ClickHouse Cloud предлагают аналогичный функционал.

### Представления {#views}

В Rockset вы можете создавать представления, виртуальные коллекции, определяемые SQL-запросами.
ClickHouse Cloud поддерживает несколько типов [представлений](/sql-reference/statements/create/view):

* _Обычные представления_ не хранят никакие данные. Они просто выполняют чтение из другой таблицы в момент запроса.
* _Параметризованные представления_ аналогичны обычным представлениям, но могут быть созданы с параметрами, разрешаемыми в момент запроса.
* _Материализованные представления_ хранят данные, преобразованные соответствующим запросом `SELECT`. Они как триггер, который срабатывает при добавлении новых данных в исходные данные, на которые они ссылаются.

### Псевдонимы {#aliases}

Псевдонимы Rockset используются для ассоциации нескольких имен с коллекцией.
ClickHouse Cloud не поддерживает аналогичную функцию.

### Рабочие пространства {#workspaces}

Рабочие пространства Rockset представляют собой контейнеры, которые содержат ресурсы (т.е. коллекции, лямбда-запросы, представления и псевдонимы) и другие рабочие пространства.

В ClickHouse Cloud вы можете использовать разные сервисы для полного разделения.
Также вы можете создавать базы данных для упрощения доступа в RBAC к различным таблицам/представлениям. 

## Соображения по дизайну {#design-considerations}

В этом разделе мы рассмотрим некоторые ключевые особенности Rockset и узнаем, как решить их, используя ClickHouse Cloud. 

### Поддержка JSON {#json-support}

Rockset поддерживает расширенную версию формата JSON, которая позволяет использовать специфические для Rockset типы.

Существует несколько способов работы с JSON в ClickHouse:

* Выведение JSON
* Извлечение JSON во время запроса
* Извлечение JSON во время вставки

Чтобы понять наилучший подход для вашего случая использования, смотрите [нашу документацию по JSON](/integrations/data-formats/json/overview).

Кроме того, в ClickHouse скоро появится [тип данных для колонки полуструктурированных данных](https://github.com/ClickHouse/ClickHouse/issues/54864).
Этот новый тип должен предоставить пользователям гибкость, которая предлагается типом JSON в Rockset.

### Поиск по полному тексту {#full-text-search}

Rockset поддерживает полнотекстовый поиск с помощью функции `SEARCH`.
Хотя ClickHouse не является поисковой системой, он имеет [различные функции для поиска по строкам](/sql-reference/functions/string-search-functions). 
ClickHouse также поддерживает [фильтры Блума](/optimize/skipping-indexes), которые могут помочь во многих сценариях.

### Векторный поиск {#vector-search}

Rockset имеет индекс сходства, который можно использовать для индексации эмбеддингов, используемых в приложениях векторного поиска.

ClickHouse также может быть использован для векторного поиска, используя линейные сканирования:
- [Векторный поиск с ClickHouse - Часть 1](https://clickhouse.com/blog/vector-search-clickhouse-p1?loc=docs-rockest-migrations)
- [Векторный поиск с ClickHouse - Часть 2](https://clickhouse.com/blog/vector-search-clickhouse-p2?loc=docs-rockest-migrations)

ClickHouse также имеет [индекс сходства для векторного поиска](/engines/table-engines/mergetree-family/annindexes), но этот подход в настоящее время является экспериментальным и пока не совместим с [новым анализатором запросов](/guides/developer/understanding-query-execution-with-the-analyzer). 

### Загрузка данных из OLTP баз данных {#ingesting-data-from-oltp-databases}

Управляемые интеграции Rockset поддерживают загрузку данных из OLTP баз данных, таких как MongoDB и DynamoDB.

Если вы загружаете данные из DynamoDB, следуйте руководству по интеграции с DynamoDB [здесь](/integrations/data-ingestion/dbms/dynamodb/index.md).

### Разделение вычислений {#compute-compute-separation}

Разделение вычислений - это архитектурный шаблон проектирования в системах анализа в реальном времени, который позволяет справляться с внезапными всплесками входящих данных или запросов.
Если один компонент обрабатывает как загрузку, так и запросы, то мы увидим увеличение задержки загрузки, если произойдет нап flood из запросов, и задержка запросов увеличится, если произойдет нап flood данных для загрузки.

Разделение вычислений отделяет пути кода для загрузки данных и обработки запросов, чтобы избежать этой проблемы, и эта функция была реализована в Rockset в марте 2023 года.

Эта функция в настоящее время внедряется в ClickHouse Cloud и почти готова к частному просмотру. Пожалуйста, свяжитесь с поддержкой, чтобы активировать её.

## Бесплатные услуги миграции {#free-migration-services}

Мы понимаем, что это стрессовое время для пользователей Rockset — никто не хочет переносить рабочую базу данных за такой короткий промежуток времени!

Если ClickHouse может быть хорошим вариантом для вас, мы [предоставим бесплатные услуги миграции](https://clickhouse.com/comparison/rockset?loc=docs-rockest-migrations), чтобы помочь сделать переход более плавным. 
