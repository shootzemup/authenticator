require('../conf');
accountsModel = require('../models/accountsModel');

exports.authenticate = function (db, username, password, done) {
	conf.debug('Authenticating:', username, ':', password);
	accountsModel.authenticate(db, username, password, function (err, res) {
		if (err) throw err;
		if (res && res._id) {
			accountsModel.notifyConnection(db, res._id);
			done("Access granted");
		}
		else {
			done("Restricted access: unknown user `" + username + 
				 "' or invalid password.");
		}
	});
};

exports.createUser = function (db, username, password, password_repeat, done) {
	if (password != password_repeat) {
		return done("Password do not match. Try again.")
	}
	conf.debug("Creating user:", username, ' with password:', password);
	accountsModel.insert(db, username, password, function (err, res) {
		// if (err) throw err;
		if (err) {
			console.error("An error occured: ", err);
			return done('Unable to create user `' + username + 
						'\'. User may already exist.');
		}
		done("Account " + username + " successfully created!");
	});
	// 	conf.error("An error occured");
	// 	done("Unable to create user `" + username + "'. User may already exist");
	// }
}