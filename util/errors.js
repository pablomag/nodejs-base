const winston = require('winston');
const error = require('../middleware/error');

module.exports = function(app)
{
	app.use(error);

	winston.add(winston.transports.File, { filename: 'errors.log' });

	winston.handleExceptions(
		new winston.transports.File({ filename: 'exceptions.log' }),
		new winston.transports.Console({ colorize: true, prettyPrint: true }));

	process.on('uncaughtRejection', (ex) =>
	{
		winstong.log('(ERROR) Unhandled rejection');
		winston.error(ex.message, ex);
		process.exit(1);
	});
};
