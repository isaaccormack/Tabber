import winston, { format, transports } from "winston";

const {printf, combine, timestamp} = format;

const MAX_FILE_SIZE = 10 * 1000 * 1000; // 10MB per file max
const MAX_NUM_FILES = 10; // 2 logs * 10 files per log * 10MB per file = 200MB for logging max

const myFormat = printf(({level, message, timestamp}) => {
    return `${timestamp}: [${level}] ${message}`;
});

const logger = winston.createLogger({
    format: combine(
        format.colorize(),
        format.splat(),
        timestamp(),
        myFormat,
    ),
    transports: [
        new transports.File({
            filename: 'logs/error.log', level: 'error',
            handleExceptions: true,
            maxsize: MAX_FILE_SIZE,
            maxFiles: MAX_NUM_FILES
        }),
        new transports.File({
            filename: 'logs/combined.log',
            maxsize: MAX_FILE_SIZE,
            maxFiles: MAX_NUM_FILES
        }),
    ]
});

if (process.env.NODE_ENV !== 'prod') {
    logger.add(new transports.Console());
}

module.exports = logger;
