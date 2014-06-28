authent = require('./authenticator');
loadBalancer = require('./loadBalancer');

require('../conf');

/* 
Available routes. Each is an association regexp - handler.
The regexp can catch any number of groups which will be given
to the corresponding handler. It *MUST NOT* start with `^` or
end with `$` as these special characters will be automatically added
when parsing the query.
All the handlers should have the following structure:
```
myHandler = function (db, group1, group2, ... done) { do_stuff() };
```
Where db is the db objects and done is a callback that looks like:
```
function (str) {
	socket.write(str);
	socket.end('\n');
}
```
*/
var routes = {
	"ping": function (db, done) { done('ping'); },
	"echo/(.+)": function (db, word, done) { done(word+''); },
	"user/authent/(\\w+)/(.+)":  authent.authenticate,
	"user/create/(\\w+)/(.+)/(.+)": authent.createUser,
	"server/connect/(.+)/(.+)/(.+)": loadBalancer.newGameServer,
	"server/disconnect/(.+)/(.+)": loadBalancer.deleteGameServer,
	"(.*)": function (db, data, done) {
		console.error('Unable to find any route for input:', data);
		done('Error: command not found.');
	}
};

/*
Route parser. Will call the appropriate function depending
on the route matched by `data`.
The parameter `db` will be given to the called function as its 
first parameter, the parameter `done` will be given to the called
function as its last one.
*/
exports.parseRoutes = function (db, data, done) {
	// successively test all the routes.
	// Only the first match is executed
	for (var r in routes) {
		// note: adding \r\n for compatibility with telnet
		var re = new RegExp('^' + r + '\x0D?\n?$');
		params = re.exec(data);
		if (params) {
			conf.debug('Matching route:', r, 'with data:', data);
			// the first parameter is the socket
			params[0] = db;
			params.push(done);
			// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
			try {
				return routes[r].apply(null, params);
			}
			catch (err) {
				console.error(err)
				return done("An unexpected error occured, please try again.");
			}
		}
	};
};