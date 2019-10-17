const mongoose = require('mongoose');
const winston = require('winston');

require('dotenv/config');

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_CONNECTION,
{
	user: process.env.DB_USER,
	pass: process.env.DB_PASS,
	useNewUrlParser: true
},
(err) => {
	if (err)
		winston.error("Could not connect to MongoDB")
	else
		winston.info("MongoDB up and running")
});
