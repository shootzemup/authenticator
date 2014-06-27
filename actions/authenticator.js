require('../conf');

exports.authenticate = function (db, username, password, done) {
	conf.debug('Authenticating:', username, ':', password);
	done("Access granted\n");
};