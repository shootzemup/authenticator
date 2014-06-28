crypto = require('crypto');

require('../conf');
accountsModel = require('../models/accountsModel');
loadBalancer = require('./loadBalancer');


exports.authenticate = function (db, username, password, done) {
	conf.debug('Authenticating:', username, ':', password);
	// retrieve salt
	accountsModel.getSalt(db, username, function (err, res) {
		if (err) throw err;
		if (!res) {
			return done('user_restricted_access', username);
		}
		else {
			conf.debug("Salt found for user: " + username);
			// compute checksum of salt+pass+salt
			var shasum = crypto.createHash(conf.crypto.hash_algo);
			shasum.update(res.salt + password + res.salt);
			// authenticate the user
			accountsModel.authenticate(db, username, shasum.digest(conf.crypto.digest), function (err, res) {
				if (err) throw err;
				if (res && res._id) {
					// update the last_connection_date
					accountsModel.notifyConnection(db, res._id);
					// dispatch the user to the less loaded game server
					loadBalancer.dispatchUser(db, done);
				}
				else 
					done('user_restricted_access', username);
			});
		}
	});
};

var getRandomSalt = function (len) {
 return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString(conf.crypto.digest)   // convert to base64 format
        .slice(0, len)        // return required number of characters
}


exports.createUser = function (db, username, password, password_repeat, done) {
	if (password != password_repeat) {
		return done('account_passwords_mismatch')
	}
	conf.debug("Creating user:", username, ' with password:', password);
	// generating salt
	var salt = getRandomSalt(conf.crypto.salt_len);
	// compute checksum of salt+pass+salt
	var shasum = crypto.createHash(conf.crypto.hash_algo)
	shasum.update(salt + password + salt);
	// create the user
	accountsModel.insert(db, username, shasum.digest(conf.crypto.digest), salt, function (err, res) {
		if (err) {
			console.error("An error occured: ", err);
			return done('account_creation_error', username);
		}
		conf.debug("Account " + username + "successfully created!");
		done('account_created');
	});
}