require('../conf');
/*
Model of the accounts:
account = {
	username: string
	password: string
	last_connection_date: timestamp
	creation_date: timestamp
}
*/

exports.insert = function (db, username, password, done) {
	db.Accounts.insert({
		username: username,
		password: password,
		last_connection_date: null,
		creation_date: Date.now()
	}, done);
};

exports.authenticate = function (db, username, password, done) {
	db.Accounts.findOne({
		username: username,
		password: password
	}, done);
};

exports.notifyConnection = function (db, id) {
	db.Accounts.update({_id: id}, {last_connection_date: Date.now()}, function (err, res) {
		if (err) throw err;
	});
};

exports.initialize = function (db, done) {
	// ensure that the collection exists
	db.Accounts = db.collection('accounts');
	// ensure that the index is created on the username
	db.Accounts.ensureIndex({username: 1}, {unique: true}, function (err, res) {
		if (err) throw err;
		conf.debug('Account model successfully initialized');
		done();
	});
};