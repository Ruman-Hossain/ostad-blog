const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `blogerror.log`
    // - Write all logs with importance level of `info` or less to `blogcombined.log`
    //
    new winston.transports.File({ filename: 'blogerror.log', level: 'error' }),
    new winston.transports.File({ filename: 'blogcombined.log' }),
  ],
});
module.exports = logger;