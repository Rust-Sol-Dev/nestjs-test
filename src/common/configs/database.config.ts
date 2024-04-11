import { registerAs } from "@nestjs/config";
import path = require("path");

export default registerAs("databaseConfig", () => ({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")],
  subscribers: [path.join(__dirname, "../**/*.subscriber{.ts,.js}")],
  synchronize: true,
  logging: process.env.DB_LOGGING === "true",
  migrationsTableName: "migrations",
  migrations: [path.join(__dirname, "../migrations/*{.ts,.js")],
  charset: "utf8mb4_unicode_ci",
  seeds: [path.join(__dirname, "../database/seeds/**/*{.ts,.js}")],
  factories: [path.join(__dirname, "../database/factories/**/*{.ts,.js}")],
  cli: {
    entitiesDir: "src/**/",
    migrationsDir: process.env.DB_MIGRATIONS_DIR,
  },
  legacySpatialSupport: false,
  extra: {
    connectionLimit: process.env.POSTGRESQL_CONNECTION_LIMIT || 200,
    waitForConnections: process.env.POSTGRESQL_WAIT_FOR_CONNECTIONS === "true",
  },
  poolSize: process.env.TYPEORM_POOL_SIZE,
  ssl: false,
}));
