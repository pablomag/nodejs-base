const index = require('../controllers/indexController');
const user = require('../controllers/userController');

module.exports = function(app)
{
	/* Auth */
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});

	/* Home */
	app.use('/', index);

	/* User */
	app.use('/user', user);
};
