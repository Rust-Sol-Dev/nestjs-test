import { DataSource } from "typeorm";
import path = require("path");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, "../**/*.entity{.ts,.js}")],
  subscribers: [path.join(__dirname, "../**/*.subscriber{.ts,.js}")],
  synchronize: true,
  logging: process.env.DB_LOGGING === "true",
  migrations: [path.join(__dirname, "../database/migrations/*")],
  extra: {
    connectionLimit: process.env.POSTGRESQL_CONNECTION_LIMIT || 200,
    waitForConnections: process.env.POSTGRESQL_WAIT_FOR_CONNECTIONS === "true",
  },
  poolSize: Number(process.env.TYPEORM_POOL_SIZE),
  ssl: { rejectUnauthorized: process.env.POSTGRESQL_TLS === "true" },
});
