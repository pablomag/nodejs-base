'use strict';

const express = require('express');
const session = require('express-session');
const app = express();

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

app.use(session({
	secret: 'NotSoSecretPassword',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: expiryDate,
		secure: true,
		sameSite: 'none'
	}
}));

/* Constants */
module.exports = Object.freeze({
	PROJECT_NAME: "Node.js base project",
	PROJECT_VERSION: "1.0.0"
});

/* View engine */
const hbs = require('express-handlebars');

app.engine('hbs', hbs({
	extname: 'hbs',
	defaultLayout: 'layout',
	layoutsDir: __dirname + '/views'
}));

/* Static files */
app.use('/public', express.static('public'));

/* Error logger */
const winston = require('winston');
require('./util/errors')(app);

/* Config */
require('./util/config');

/* Database */
require('./util/database');

/* Routes */
require('./router/routes')(app);

/* Server */
const port = process.env.APP_PORT || 3000;
const server = app.listen(port, () =>
				winston.info(`Express server listening on port ${port}`));

module.exports = server;
