require('../conf');
/*
Model of the game servers. 
The gamseServers collection store the adress and the 
load of each game server.
gameServer = {
	ip: string
	name: string
	load: int
}
*/

exports.insert = function (db, name, ip, done) {
	db.GameServers.insert({
		name: name,
		ip: ip,
		load: 0
	}, done);
}

exports.getLessLoaded = function (db, done) {
	db.GameServers.aggregate([{
		$sort: { load: 1 }
	}, {
		$limit: 1
	}], function (err, res) {
		if (err) done(err);
		if (res && res.length > 0) {
			done(null, res[0]);
		}
		else
			done(null, res);
	});
}

exports.getByIp = function (db, ip, done) {
	db.GameServers.findOne({
		id: ip
	}, done);
}

exports.incrementLoad = function (db, id, done) {
	db.GameServers.update({ _id: id},  {
		$inc: {
			load: 1
		}
	}, done);
}

exports.remove = function (db, id, done) {
	db.GameServers.remove({ _id: id}, {justOne: 1}, done);
}

exports.removeByIp = function (db, ip, done) {
	db.GameServers.remove({ ip: ip}, {justOne: 1}, done);
}

exports.initialize = function (db, done) {
	// ensure the collection exists
	db.GameServers = db.collection('gameServers');
	// ensure the index on the ip exists
	db.GameServers.ensureIndex({ip: 1}, {unique: true}, function (err, res) {
		if (err) throw err;
		conf.debug("GameServers model successfully created");
		done();
	});
}