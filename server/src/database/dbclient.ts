import {createConnection, Connection} from "typeorm"
import { LickCount } from "../entity/lickCount";

let db: Connection;

/**
 * Initialize database connection
 *
 * Calls the passed callback only once the database is connected - so
 * this should be (and is, in bin/www) called with server.listen() as the
 * callback. This way, the (singular) database connection is available
 * synchonously throughout the life of the server.
 */

export function initDb(callback: (err: Error | null, db: Connection) => void): void {
    if (db) {
        return callback(new Error("Cannot initialize database twice"), undefined);
    }

    // do any necessary database initialization here
    const onConnected = (conn: Connection) => {
        db = conn;

        conn.getRepository(LickCount).findOne(1)
            .then((lickCount) => {
                if (!lickCount) {
                    conn.getRepository(LickCount).insert({id: 1, count: 0})
                }
            })
            .then(() => callback(null, db))
            .catch(err => callback(err, db));
    }

    createConnection()
        .then((conn: Connection) => onConnected(conn))
        .catch(err => callback(err, db))
}
