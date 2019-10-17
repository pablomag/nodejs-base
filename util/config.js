const config = require('config');

// SET nodeJsBaseProject_jwtPrivateKey=yourSuperSecretAppKey

module.exports = () => {

	if (config.get('jwtPrivateKey'))
	{
		throw new Error('FATAL ERROR: jwtPrivateKey is not set!');
		process.end(1);
	}
}
