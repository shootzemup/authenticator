gameServersModel = require('../models/gameServersModel');
require('../conf')

// called when a new game server connects to the network
exports.newGameServer = function (db, name, ip, secret, done) {
	// check the validity of the secret token.
	// Allow to ensure that the new server is one of ours
	if (!conf.DEBUG && secret != conf.internal.secret)
		return done("Invalid secret token");
	gameServersModel.insert(db, name, ip, function (err, res) {
		if (err)
			console.error("The server " + name + '(' + ip + ') already exists!');
		done('server_registered');
	})
}

// called when a game server disconnect from the network
exports.deleteGameServer = function (db, ip, secret, done) {
	if (!conf.DEBUG && secret != conf.internal.secret)
		return done("Invalid secret token");
	gameServersModel.removeByIp(db, ip, function (err, res) {
		if (err) throw err;
		done('server_removed')
	});
}

exports.dispatchUser = function (db, done) {
	gameServersModel.getLessLoaded(db, function (err, res) {
		if (err) throw err;
		conf.debug("Less loaded:", res);
		gameServersModel.incrementLoad(db, res._id, function (err) {
			if (err) throw err;
			done('user_dispatched', res.name, res.ip);
		})
	})
}