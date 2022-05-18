const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

// Logging levels
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
// };

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${JSON.stringify(message)}`;
});

let logger = createLogger({
    format: combine(
        label({ label: 'LOG' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: 'logs.log' }),
    ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}


module.exports = logger