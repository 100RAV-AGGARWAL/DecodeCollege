const winston = require("winston");
const config = require("config");
const loggingConfig = config.get("logging");
const DailyRotateFile = require('winston-daily-rotate-file');

var transport = new DailyRotateFile({
	filename: loggingConfig.fileLocation + 'application-%DATE%.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d'
});

const logger = winston.createLogger({
	level: loggingConfig.level,
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		winston.format.printf((info) =>
			JSON.stringify({
				t: info.timestamp,
				l: info.level,
				m: info.message,
				s: info.splat !== undefined ? `${info.splat}` : '',
			}) + ','
		)
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		transport
	],
});
if (config.get('environment') === 'dev') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple(),
	}));
}

module.exports = logger;