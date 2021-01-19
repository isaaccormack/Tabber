import {createConnection, Connection} from "typeorm"

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
    function onConnected(conn: Connection) {
        db = conn;
        callback(null, db)
    }

    createConnection()
        .then((conn: Connection) => onConnected(conn))
        .catch(err => callback(err, db))
}
