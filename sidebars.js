// Important note: When linking to pages, you must link to the file path
// and NOT the URL slug

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "Get Started",
      collapsed: false,
      collapsible: false,
      items: [
        "en/intro",
        "en/quick-start",
        "en/tutorial",
        "en/getting-started/install",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      className: "top-nav-item",
      collapsed: false,
      collapsible: false,
      items: [
        "en/concepts/why-clickhouse-is-so-fast",
        "en/concepts/olap",
        "en/about-us/distinctive-features",
        "en/concepts/glossary",
      ],
    },
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      collapsible: false,
      items: [
        "en/guides/creating-tables",
        "en/guides/inserting-data",
        "en/guides/writing-queries",
        "en/guides/developer/mutations",
        {
          type: "category",
          label: "Observability",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "doc",
              label: "Overview",
              id: "en/use-cases/observability/index",
            },
            "en/use-cases/observability/integrating-opentelemetry",
            "en/use-cases/observability/schema-design",
            "en/use-cases/observability/managing-data",
            "en/use-cases/observability/grafana",
            "en/use-cases/observability/demo-application",
          ],
        },
        {
          type: "category",
          label: "Advanced Guides",
          collapsed: true,
          collapsible: true,
          items: [
            "en/guides/developer/ttl",
            "en/guides/developer/deduplication",
            "en/guides/developer/debugging-memory-issues",
            "en/sql-reference/transactions",
            "en/guides/developer/alternative-query-languages",
            "en/guides/developer/understanding-query-execution-with-the-analyzer",
            "en/guides/developer/time-series-filling-gaps",
          ],
        },
        {
          type: "category",
          label: "Best Practices",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/guides/best-practices",
            },
          ],
        },
        {
          type: "category",
          label: "Example Datasets",
          collapsed: true,
          collapsible: true,
          items: [
            "en/getting-started/index",
            {
              type: "autogenerated",
              dirName: "en/getting-started/example-datasets",
            },
          ],
        },
        "en/guides/troubleshooting",
      ],
    },
    {
      type: "category",
      label: "Migrations",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "doc",
          id: "en/migrations/bigquery/equivalent-concepts",
          label: "BigQuery",
        },
        "en/migrations/snowflake",
        {
          type: "doc",
          id: "en/migrations/postgres/overview",
          label: "PostgreSQL",
        },
        "en/integrations/data-ingestion/dbms/mysql/index",
        "en/integrations/data-ingestion/redshift/index",
        "en/integrations/data-ingestion/dbms/dynamodb/index",
        {
          type: "doc",
          id: "en/integrations/migration/rockset",
          label: "Rockset",
        },
      ],
    },
    {
      type: "category",
      label: "Data Modeling",
      collapsed: false,
      collapsible: false,
      items: [
        "en/data-modeling/schema-design",
        "en/dictionary/index",
        "en/materialized-view/index",
        {
          type: "doc",
          label: "Data Compression",
          id: "en/data-compression/compression-in-clickhouse",
        },
        "en/data-modeling/denormalization",
      ],
    },
    {
      type: "category",
      label: "Managing Data",
      collapsed: false,
      collapsible: false,
      items: [
        "en/managing-data/updates",
        "en/managing-data/deletes",
        {
          type: "doc",
          id: "en/guides/joining-tables",
          label: "JOINs",
        },
      ]
    },
    {
      type: "category",
      label: "Integrations",
      link: {
        type: "doc",
        id: "en/integrations/index",
      },
      collapsed: false,
      collapsible: false,
      items: [
        "en/integrations/data-ingestion/s3/index",
        "en/integrations/data-ingestion/gcs/index",
        {
          type: "category",
          label: "Kafka",
          className: "top-nav-item",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/data-ingestion/kafka/index",
            "en/integrations/data-ingestion/clickpipes/kafka",
            "en/integrations/data-ingestion/kafka/kafka-clickhouse-connect-sink",
            "en/integrations/data-ingestion/kafka/confluent/custom-connector",
            "en/integrations/data-ingestion/kafka/msk/index",
            "en/integrations/data-ingestion/kafka/kafka-vector",
            "en/integrations/data-ingestion/kafka/producer",
            "en/integrations/data-ingestion/kafka/kafka-table-engine",
          ],
        },
        {
          type: "category",
          label: "ClickPipes",
          className: "top-nav-item",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/data-ingestion/clickpipes/index",
            "en/integrations/data-ingestion/clickpipes/kafka",
            "en/integrations/data-ingestion/clickpipes/object-storage",
            "en/integrations/data-ingestion/clickpipes/kinesis",
            "en/integrations/data-ingestion/clickpipes/postgres",
          ],
        },
        "en/integrations/data-ingestion/etl-tools/dbt/index",
        "en/integrations/data-ingestion/etl-tools/fivetran/index",
        "en/integrations/data-ingestion/apache-spark/index",
        "en/integrations/data-ingestion/aws-glue/index",
        "en/integrations/data-ingestion/insert-local-files",
        "en/integrations/data-ingestion/dbms/jdbc-with-clickhouse",
        "en/integrations/data-ingestion/dbms/odbc-with-clickhouse",
        {
          type: "category",
          label: "More...",
          className: "top-nav-item",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/data-ingestion/etl-tools/airbyte-and-clickhouse",
            "en/integrations/data-ingestion/emqx/index",
            {
              type: "link",
              label: "Cassandra",
              href: "/en/sql-reference/dictionaries#cassandra",
            },
            "en/sql-reference/table-functions/deltalake",
            "en/integrations/data-ingestion/etl-tools/dlt-and-clickhouse",
            "en/engines/table-engines/integrations/embedded-rocksdb",
            "en/engines/table-engines/integrations/hive",
            "en/engines/table-engines/integrations/hudi",
            "en/engines/table-engines/integrations/iceberg",
            "en/integrations/data-ingestion/s3-minio",
            "en/engines/table-engines/integrations/mongodb",
            "en/engines/table-engines/integrations/nats",
            "en/integrations/data-ingestion/etl-tools/nifi-and-clickhouse",
            "en/integrations/prometheus",
            "en/engines/table-engines/integrations/rabbitmq",
            {
              type: "link",
              label: "Redis",
              href: "/en/sql-reference/dictionaries#redis",
            },
            "en/integrations/data-visualization/splunk-and-clickhouse",
            "en/engines/table-engines/integrations/sqlite",
            "en/integrations/data-ingestion/etl-tools/vector-to-clickhouse",
            "en/integrations/deployment/easypanel/index",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Data Formats",
      link: {
        type: "doc",
        id: "en/integrations/data-ingestion/data-formats/intro",
      },
      collapsed: false,
      collapsible: false,
      items: [
        "en/integrations/data-ingestion/data-formats/binary",
        "en/integrations/data-ingestion/data-formats/csv-tsv",
        {
          type: "category",
          label: "JSON",
          className: "top-nav-item",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/data-ingestion/data-formats/json/intro",
            "en/integrations/data-ingestion/data-formats/json/loading",
            "en/integrations/data-ingestion/data-formats/json/inference",
            "en/integrations/data-ingestion/data-formats/json/schema",
            "en/integrations/data-ingestion/data-formats/json/exporting",
            "en/integrations/data-ingestion/data-formats/json/formats",
            "en/integrations/data-ingestion/data-formats/json/other",
          ],
        },
        "en/integrations/data-ingestion/data-formats/parquet",
        "en/integrations/data-ingestion/data-formats/sql",
        "en/integrations/data-ingestion/data-formats/arrow-avro-orc",
        "en/integrations/data-ingestion/data-formats/templates-regex",
        {
          type: "doc",
          id: "en/interfaces/formats",
          label: "View all formats...",
        },
      ],
    },
    {
      type: "category",
      label: "Clients and Drivers",
      collapsed: false,
      collapsible: false,
      items: [
        "en/integrations/clickhouse-client-local",
        "en/integrations/cli",
        "en/operations/utilities/clickhouse-local",
        "en/integrations/sql-clients/sql-console",
        "en/getting-started/playground",
        "en/integrations/language-clients/js",
        "en/integrations/language-clients/java/index",
        "en/integrations/language-clients/python/index",
        {
          type: "category",
          label: "View all languages",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/language-clients/js",
            "en/integrations/language-clients/java/index",
            "en/integrations/language-clients/go/index",
            "en/integrations/language-clients/python/index",
          ],
        },
        {
          type: "category",
          label: "Drivers and Interfaces",
          collapsed: true,
          collapsible: true,
          items: [
            "en/interfaces/overview",
            "en/interfaces/cli",
            "en/interfaces/cpp",
            "en/interfaces/http",
            "en/interfaces/tcp",
            "en/interfaces/jdbc",
            "en/interfaces/mysql",
            "en/interfaces/odbc",
            "en/interfaces/postgresql",
            "en/interfaces/schema-inference",
            "en/interfaces/grpc",
            {
              type: "category",
              label: "Third-party Interfaces",
              collapsed: true,
              collapsible: true,
              items: [
                {
                  type: "autogenerated",
                  dirName: "en/interfaces/third-party",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "SQL Clients",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/sql-clients/datagrip",
            "en/integrations/sql-clients/dbeaver",
            "en/integrations/sql-clients/dbvisualizer",
            "en/integrations/sql-clients/jupysql",
            "en/integrations/sql-clients/qstudio",
            "en/integrations/sql-clients/tablum",
          ],
        },
        {
          type: "category",
          label: "Business Intelligence",
          collapsed: true,
          collapsible: true,
          items: [
            "en/integrations/data-visualization",
            "en/integrations/data-visualization/deepnote",
            "en/integrations/data-visualization/draxlr-and-clickhouse",
            "en/integrations/data-visualization/explo-and-clickhouse",
            {
              type: "category",
              label: "Grafana",
              className: "top-nav-item",
              collapsed: true,
              collapsible: true,
              items: [
                "en/integrations/data-visualization/grafana/index",
                "en/integrations/data-visualization/grafana/query-builder",
                "en/integrations/data-visualization/grafana/config",
              ],
            },
            "en/integrations/data-visualization/hashboard-and-clickhouse",
            "en/integrations/data-visualization/looker-and-clickhouse",
            "en/integrations/data-visualization/looker-studio-and-clickhouse",
            "en/integrations/data-visualization/metabase-and-clickhouse",
            "en/integrations/data-visualization/mitzu-and-clickhouse",
            "en/integrations/data-visualization/omni-and-clickhouse",
            "en/integrations/data-visualization/powerbi-and-clickhouse",
            "en/integrations/data-visualization/quicksight-and-clickhouse",
            "en/integrations/data-visualization/rocketbi-and-clickhouse",
            "en/integrations/data-visualization/superset-and-clickhouse",
            "en/integrations/data-visualization/tableau-and-clickhouse",
            "en/integrations/data-visualization/tableau-online-and-clickhouse",
            "en/integrations/data-visualization/zingdata-and-clickhouse",
          ],
        },
        {
          type: "category",
          label: "No-Code platforms",
          collapsed: true,
          collapsible: true,
          items: ["en/integrations/no-code/retool"],
        },
      ],
    },
    {
      type: "category",
      label: "Managing ClickHouse",
      collapsed: false,
      collapsible: false,
      items: [
        "en/guides/sre/user-management/index",
        "en/operations/backup",
        "en/operations/monitoring",
        {
          type: "category",
          label: "Deploying",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/deployment-guides",
            },
            "en/guides/sizing-and-hardware-recommendations",
            "en/architecture/cluster-deployment",
            "en/guides/separation-storage-compute",
            "en/operations/cluster-discovery",
          ],
        },
        {
          type: "category",
          label: "Security",
          collapsed: true,
          collapsible: true,
          items: [
            "en/guides/sre/user-management/configuring-ldap",
            "en/guides/sre/user-management/ssl-user-auth",
            "en/operations/named-collections",
            "en/guides/sre/configuring-ssl",
            "en/guides/sre/network-ports",
            "en/operations/ssl-zookeeper",
            {
              type: "category",
              label: "External Authentication",
              items: [
                {
                  type: "autogenerated",
                  dirName: "en/operations/external-authenticators",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          collapsed: true,
          collapsible: true,
          label: "Advanced Settings",
          items: [
            {
              type: "autogenerated",
              dirName: "en/operations/settings",
            },
            "en/operations/configuration-files",
            "en/operations/server-configuration-parameters/settings",
            "en/settings/beta-and-experimental-features",
          ],
        },
        {
          type: "category",
          collapsed: true,
          collapsible: true,
          label: "Performance and Optimizations",
          items: [
            "en/guides/sre/scaling-clusters",
            "en/operations/caches",
            "en/operations/workload-scheduling",
            "en/operations/query-cache",
            "en/operations/quotas",
            "en/operations/optimizing-performance/sampling-query-profiler",
            "en/operations/performance-test",
            "en/operations/optimizing-performance/profile-guided-optimization",
            "en/operations/analyzer"
          ],
        },
        {
          type: "category",
          collapsed: true,
          collapsible: true,
          label: "Tools and Utilities",
          items: [
            {
              type: "autogenerated",
              dirName: "en/operations/utilities",
            },
            "en/tools-and-utilities/static-files-disk-uploader",
          ],
        },
        {
          type: "category",
          collapsed: true,
          collapsible: true,
          label: "More...",
          items: [
            "en/operations/update",
            "en/operations/named-collections",
            "en/operations/storing-data",
            "en/guides/sre/keeper/index",
            "en/guides/sre/configuring-ssl",
            "en/operations/opentelemetry",
            "en/operations/allocation-profiling",
            {
              type: "category",
              collapsed: true,
              collapsible: true,
              label: "System Tables",
              items: [
                {
                  type: "autogenerated",
                  dirName: "en/operations/system-tables",
                },
              ],
            },
            "en/operations/tips",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "About ClickHouse",
      link: {
        type: "doc",
        id: "en/about-us/intro",
      },
      collapsed: false,
      collapsible: false,
      items: [
        "en/about-us/adopters",
        "en/about-us/support",
        "en/about-us/cloud",
        {
          type: "autogenerated",
          dirName: "en/whats-new",
        },
        {
          type: "category",
          label: "Contribute",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/development",
            },
            {
              type: "category",
              label: "Native Protocol",
              collapsed: true,
              collapsible: true,
              items: [
                {
                  type: "autogenerated",
                  dirName: "en/native-protocol",
                },
              ],
            },
          ],
        },
        "en/about-us/history",
      ],
    },
  ],

  cloud: [
    {
      type: "category",
      label: "Get Started",
      collapsed: false,
      collapsible: false,
      className: "top-nav-item",
      items: [
        "en/cloud-index",
        {
          type: "doc",
          id: "en/get-started/cloud-quick-start",
        },
        "en/get-started/sql-console",
        "en/get-started/query-insights",
        "en/get-started/query-endpoints",
        "en/cloud/support",
      ],
    },
    {
      type: "category",
      label: "Managing Cloud",
      collapsed: false,
      collapsible: false,
      className: "top-nav-item",
      items: [
        "en/cloud/manage/service-types",
        "en/cloud/manage/integrations",
        "en/cloud/manage/backups",
        {
          type: "category",
          label: "Billing",
          items: [
            "en/cloud/manage/billing",
            "en/cloud/manage/billing/payment-thresholds",
            "en/cloud/manage/troubleshooting-billing-issues",
            ,
            {
              type: "category",
              label: "Marketplace",
              items: [
                "en/cloud/manage/billing/marketplace/index",
                "en/cloud/manage/billing/marketplace/aws-marketplace-payg",
                "en/cloud/manage/billing/marketplace/aws-marketplace-committed",
                "en/cloud/manage/billing/marketplace/gcp-marketplace-payg",
                "en/cloud/manage/billing/marketplace/gcp-marketplace-committed",
                "en/cloud/manage/billing/marketplace/azure-marketplace-payg",
                "en/cloud/manage/billing/marketplace/azure-marketplace-committed",
              ],
            },
          ],
        },
        "en/cloud/manage/settings",
        "en/cloud/manage/scaling",
        "en/cloud/manage/service-uptime",
        "en/cloud/manage/upgrades",
        "en/cloud/manage/account-close",
        "en/cloud/manage/postman",
        "en/faq/troubleshooting",
      ],
    },
    {
      type: "category",
      label: "Cloud API",
      collapsed: false,
      collapsible: false,
      className: "top-nav-item",
      items: [
        {
          type: "doc",
          id: "en/cloud/manage/api/api-overview",
        },
        "en/cloud/manage/openapi",
        {
          type: "category",
          label: "API Reference",
          items: [
            "en/cloud/manage/api/invitations-api-reference",
            "en/cloud/manage/api/keys-api-reference",
            "en/cloud/manage/api/members-api-reference",
            "en/cloud/manage/api/organizations-api-reference",
            "en/cloud/manage/api/services-api-reference",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Cloud Reference ",
      collapsed: false,
      collapsible: false,
      className: "top-nav-item",
      items: [
        "en/cloud/reference/architecture",
        "en/cloud/reference/shared-merge-tree",
        "en/cloud/reference/compute-compute-separation",
        "en/cloud/reference/changelog",
        "en/cloud/reference/cloud-compatibility",
        "en/cloud/reference/supported-regions",
      ],
    },
    {
      type: "category",
      label: "Best Practices ",
      collapsed: false,
      collapsible: false,
      className: "top-nav-item",
      items: [
        "en/cloud/bestpractices/bulkinserts",
        "en/cloud/bestpractices/asyncinserts",
        "en/cloud/bestpractices/avoidmutations",
        "en/cloud/bestpractices/avoidnullablecolumns",
        "en/cloud/bestpractices/avoidoptimizefinal",
        "en/cloud/bestpractices/partitioningkey",
      ],
    },
    {
      type: "category",
      label: "Security",
      collapsed: false,
      collapsible: false,
      className: "top-nav-item",
      items: [
        "en/cloud/security/shared-responsibility-model",
        {
          type: "category",
          label: "Cloud Access Management",
          items: [
            "en/cloud/security/cloud-access-management",
            "en/cloud/security/cloud-authentication",
            "en/cloud/security/saml-sso-setup",
            "en/cloud/security/common-access-management-queries",
          ],
        },
        {
          type: "category",
          label: "Connectivity",
          items: [
            "en/cloud/security/setting-ip-filters",
            {
              type: "category",
              label: "Private Networking",
              items: [
                "en/cloud/security/private-link-overview",
                "en/cloud/security/aws-privatelink",
                "en/cloud/security/gcp-private-service-connect",
                "en/cloud/security/azure-privatelink",
              ],
            },
            "en/cloud/security/accessing-s3-data-securely",
            "en/cloud/security/cloud-endpoints-api",
          ],
        },
        "en/cloud/security/cmek",
        "en/cloud/security/audit-logging",
        {
          type: "category",
          label: "Privacy and Compliance",
          collapsed: true,
          collapsible: true,
          items: [
            "en/cloud/security/compliance-overview",
            "en/cloud/security/personal-data-access",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Migrating to Cloud",
      collapsed: false,
      collapsible: false,
      items: [
        "en/integrations/migration/index",
        "en/integrations/migration/clickhouse-to-cloud",
        "en/integrations/migration/clickhouse-local-etl",
        "en/integrations/migration/etl-tool-to-clickhouse",
        "en/integrations/migration/object-storage-to-clickhouse",
        "en/integrations/migration/upload-a-csv-file",
        {
          type: "link",
          label: "Rockset",
          href: "/en/migrations/rockset",
        },
      ],
    },
  ],

  sqlreference: [
    {
      type: "category",
      label: "Introduction",
      className: "top-nav-item",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "doc",
          id: "en/sql-reference/index",
        },
        {
          type: "doc",
          id: "en/sql-reference/syntax",
        },
        {
          type: "doc",
          id: "en/sql-reference/formats",
        },
        {
          type: "doc",
          id: "en/sql-reference/ansi",
        },
        {
          type: "category",
          label: "Data Types",
          items: [
            {
              type: "autogenerated",
              dirName: "en/sql-reference/data-types",
            },
          ],
        },
        {
          type: "category",
          label: "Statements",
          items: [
            {
              type: "autogenerated",
              dirName: "en/sql-reference/statements",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Engines",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "autogenerated",
          dirName: "en/engines",
        },
      ],
    },
    {
      type: "category",
      label: "Functions",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "category",
          label: "Regular Functions",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/sql-reference/functions",
            },
          ],
        },
        {
          type: "category",
          label: "Aggregate Functions",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/sql-reference/aggregate-functions",
            },
          ],
        },
        {
          type: "category",
          label: "Table Functions",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/sql-reference/table-functions",
            },
          ],
        },
        {
          type: "category",
          label: "Window Functions",
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: "autogenerated",
              dirName: "en/sql-reference/window-functions",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Other Features",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "autogenerated",
          dirName: "en/sql-reference/operators",
        },
        {
          type: "doc",
          id: "en/sql-reference/distributed-ddl",
        },
      ],
    },
  ],

  bigquery: [
    {
      type: "category",
        label: "BigQuery",
        collapsed: false,
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "en/migrations/bigquery/equivalent-concepts",
          },
          {
            type: "doc",
            id: "en/migrations/bigquery/migrating-to-clickhouse-cloud",
          },
          {
            type: "doc",
            id: "en/migrations/bigquery/loading-data",
          },
        ]
    },
  ],

  postgres: [
    {
      type: "category",
        label: "PostgreSQL",
        collapsed: false,
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "en/integrations/data-ingestion/dbms/postgresql/postgres-vs-clickhouse",
          },
          {
            type: "doc",
            label: "Inserting Data",
            id: "en/integrations/data-ingestion/dbms/postgresql/inserting-data",
          },
        ]
      },
      {
        type: "category",
          label: "Migration Guide",
          collapsed: false,
          collapsible: false,
          items: [
            {
              type: "doc",
              label: "Overview",
              id: "en/migrations/postgres/overview",
            },
            {
              type: "doc",
              label: "Loading data",
              id: "en/migrations/postgres/dataset",
            },
            {
              type: "doc",
              label: "Designing schemas",
              id: "en/migrations/postgres/designing-schemas",
            },
            {
              type: "doc",
              label: "Data modeling techniques",
              id: "en/migrations/postgres/data-modeling-techniques",
            },
            {
              type: "doc",
              id: "en/integrations/data-ingestion/dbms/postgresql/rewriting-postgres-queries"
            }
          ]
      },
      {
        type: "category",
          label: "SQL Reference",
          collapsed: false,
          collapsible: false,
          items: [
            {
              type: "link",
              label: "Postgres Table Function",
              href: "/en/sql-reference/table-functions/postgresql",
            },
            {
              type: "link",
              label: "Postgres Table Engine",
              href: "/en/engines/table-engines/integrations/postgresql",
            },

            {
              type: "link",
              label: "MaterializedPostgres Database Engine",
              href: "/en/engines/database-engines/materialized-postgresql",
            },
            {
              type: "doc",
              label: "Connecting to PostgreSQL",
              id: "en/integrations/data-ingestion/dbms/postgresql/index",
            },
            {
              type: "doc",
              label: "Data Type Mappings",
              id: "en/integrations/data-ingestion/dbms/postgresql/data-type-mappings",
            },
          ]
      }
  ],

  updates: [
    {
      type: "category",
        label: "Updating Data",
        collapsed: false,
        collapsible: false,
        items: [
          {
            type: "doc",
            label: "Overview",
            id: "en/managing-data/updates",
          },
          {
            type: "link",
            label: "Update Mutations",
            href: "/en/sql-reference/statements/alter/update"
          },
          {
            type: "doc",
            label: "Lightweight Updates",
            id: "en/guides/developer/lightweight-update"
          },
          {
            type: "doc",
            label: "ReplacingMergeTree",
            id: "en/migrations/postgres/replacing-merge-tree"
          },
        ]
    },
  ],

  deletes: [
    {
    type: "category",
      label: "Deleting Data",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "en/managing-data/deletes",
        },
        {
          type: "doc",
          label: "Lightweight Deletes",
          id: "en/guides/developer/lightweight-delete"
        },
        {
          type: "link",
          label: "Delete Mutations",
          href: "/en/sql-reference/statements/alter/delete"
        },
        {
          type: "link",
          label: "Truncate Table",
          href: "/en/sql-reference/statements/truncate"
        },
        {
          type: "link",
          label: "Drop Partition",
          href: "/en/sql-reference/statements/alter/partition#drop-partitionpart"
        }
      ]
    }
  ],

  dictionary: [
    {
      type: "category",
      label: "Dictionary",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "en/dictionary/index",
        },
        {
          type: "doc",
          label: "Advanced Configuration",
          id: "en/sql-reference/dictionaries/index",
        },
        {
          type: "link",
          label: "Functions",
          href: "/en/sql-reference/functions/ext-dict-functions",
        },
      ],
    },
    {
      type: "category",
      label: "SQL Reference",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "link",
          label: "Dictionary Table Engine",
          href: "/en/engines/table-engines/special/dictionary",
        },
        {
          type: "link",
          label: "CREATE DICTIONARY",
          href: "/en/sql-reference/statements/create/dictionary",
        },
        {
          type: "link",
          label: "DROP DICTIONARY",
          href: "/en/sql-reference/statements/drop#drop-dictionary",
        },
      ],
    },
  ],

  materializedView: [
    {
      type: "category",
      label: "Materialized View",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "en/materialized-view/index",
        },
        {
          type: "doc",
          label: "Cascading Materialized View",
          id: "en/guides/developer/cascading-materialized-views",
        },
        {
          type: "doc",
          label: "Refreshable Materialized View",
          id: "en/materialized-view/refreshable-materialized-view",
        },
      ],
    },
    {
      type: "category",
      label: "SQL Reference",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "link",
          label: "CREATE VIEW",
          href: "/en/sql-reference/statements/create/view",
        },
        {
          type: "link",
          label: "DROP VIEW",
          href: "/en/sql-reference/statements/drop#drop-view",
        },
        {
          type: "link",
          label: "REFRESH",
          href: "/en/sql-reference/statements/create/view#refreshable-materialized-view",
        },
      ],
    },
  ],

  dataCompression: [
    {
      type: "category",
      label: "Data Compression",
      collapsed: false,
      collapsible: false,
      items: [
        "en/data-compression/compression-in-clickhouse",
        {
          type: "link",
          label: "Applying compression codecs",
          href: "/en/sql-reference/statements/create/table#column_compression_codec",
        },
        "en/data-compression/compression-modes",
      ],
    },
  ],

  chdb: [
    {
      type: "category",
      label: "chDB",
      className: "top-nav-item",
      collapsed: false,
      collapsible: false,
      items: ["en/chdb/index", "en/chdb/data-formats", "en/chdb/sql-reference"],
    },
    {
      type: "category",
      label: "Language Clients",
      className: "top-nav-item",
      collapsed: false,
      collapsible: false,
      items: [
        "en/chdb/install/python",
        "en/chdb/install/nodejs",
        "en/chdb/install/go",
        "en/chdb/install/rust",
        "en/chdb/install/bun",
        "en/chdb/install/c",
      ],
    },
    {
      type: "category",
      label: "Integrations",
      className: "top-nav-item",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "link",
          label: "JupySQL",
          href: "https://jupysql.ploomber.io/en/latest/integrations/chdb.html",
        },
        {
          type: "link",
          label: "chdb-lambda",
          href: "https://github.com/chdb-io/chdb-lambda",
        },
        {
          type: "link",
          label: "chdb-cli",
          href: "https://github.com/chdb-io/chdb-go?tab=readme-ov-file#chdb-go-cli",
        },
      ],
    },
    {
      type: "category",
      label: "About chDB",
      className: "top-nav-item",
      collapsed: false,
      collapsible: false,
      items: [
        {
          type: "link",
          label: "Discord",
          href: "https://discord.gg/Njw5YXSPPc",
        },
        {
          type: "link",
          label: "Birth of chDB",
          href: "https://auxten.com/the-birth-of-chdb/",
        },
        {
          type: "link",
          label: "Joining ClickHouse, Inc.",
          href: "https://clickhouse.com/blog/welcome-chdb-to-clickhouse",
        },
        {
          type: "link",
          label: "Team and Contributors",
          href: "https://github.com/chdb-io/chdb#contributors",
        },
      ],
    },
  ],

  russia: [
    {
      type: "autogenerated",
      dirName: "ru",
    },
  ],
  chinese: [
    {
      type: "autogenerated",
      dirName: "zh",
    },
  ],
};

module.exports = sidebars;
