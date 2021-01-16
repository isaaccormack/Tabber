if (process.env.NODE_ENV === 'prod') {
    if (!process.env.PROD_DB_IP) throw new Error('process.env.PROD_DB_IP is not defined')
    if (!process.env.PROD_DB_PASSWORD) throw new Error('process.env.PROD_DB_PASSWORD is not defined')
}

const host = {
    local_docker: "host.docker.internal",
    prod: process.env.PROD_DB_IP
}
const password = {
    prod: process.env.PROD_DB_PASSWORD
}

module.exports = {
    "type": "mysql",
    "host": host[process.env.NODE_ENV] || "localhost",
    "port": 3306,
    "username": "root",
    "password": password[process.env.NODE_ENV] || "helloworld",
    "database": "tabber",
    "synchronize": true,
    "controllers": [
        "dist/src/controller/*.js"
    ],
    "entities": [
        "dist/src/entity/*.js"
    ],
    "subscribers": [
        "dist/src/subscriber/*.js"
    ],
    "migrations": [
        "dist/src/migration/*.js"
    ],
    "cli": {
        "controllerDir": "dist/src/controller",
        "entitiesDir": "dist/src/entity",
        "migrationsDir": "dist/src/migration",
        "subscribersDir": "dist/src/subscriber"
    }
}
