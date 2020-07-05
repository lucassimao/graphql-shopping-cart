import { ConnectionOptions } from "typeorm";

if (!process.env.DB_URL) {
  throw new Error("The DB_URL env variable is required");
}

let config: ConnectionOptions = {
  type: "postgres",
  url: process.env.DB_URL,
  entities: ["build/entities/*.js"],
  migrations: ["build/migrations/*.js"],
  synchronize: false,
  migrationsRun: false,
  logging: true,
  cli: {
    entitiesDir: `src/entities`,
    migrationsDir: `src/migrations`,
  },
};

switch (process.env.NODE_ENV) {
  case "production":
    config = {
      ...config,
      synchronize: false,
      migrationsRun: false,
      logging: false,
    };
    break;
  case "test":
    config = {
      ...config,
      synchronize: true,
      dropSchema: true,
      entities: [`src/entities/*.ts`],
    };
    break;
  default:
}

// required by the typeorm CLI
export = config;
