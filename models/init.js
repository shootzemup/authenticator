accounts = require('./accountsModel');
gameServers = require('./gameServersModel');
require('../conf.js');
/*
This function initialize all the models in a raw.
Each model will add the function related to its collection to 
the corresponding collection object. See accountsModel.js for 
documented exemples
*/
exports.initialize = function (db, done) {
	conf.debug("Initalizing models...");
	accounts.initialize(db, function () {
		gameServers.initialize(db, function () {
			// other model initialization come here
			// could use _.async for a better readability
			done();
		});
	});
}