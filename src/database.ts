import { Connection, createConnection } from "typeorm";

import * as config from "./ormconfig";

export class Database {
  private static _instance: Database;
  private constructor(private connection: Connection) {}

  public static async instance() {
    const { connection } = this._instance;
    if (!connection?.isConnected) {
      await Database.connect();
    }

    return this._instance;
  }

  public static get isConnected() {
    return this._instance?.connection.isConnected;
  }

  public static async connect() {
    if (this.isConnected) {
      return this._instance;
    }

    const connection = await createConnection(config);
    this._instance = new Database(connection);
    return this._instance;
  }

  public static async close() {
    if (this.isConnected) {
      await this._instance.connection.close();
    }
  }
}
