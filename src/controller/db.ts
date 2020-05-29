import { Connection } from "typeorm";

/**
 * db is a base class for our services that require database access.
 * By using this, we simplify and unify access to the database across
 * all of our services.
 */
export class DB {
  private _db: Connection;

  constructor(options: any) {
    if (!options.db) {
      throw new Error("db not defined.");
    }
    this._db = options.db;
  }

  get db(): Connection {
    if (!this._db) {
      throw new Error("db has not been initialized.");
    }
    return this._db;
  }
}