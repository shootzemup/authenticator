authent = require('./authenticator');
loadBalancer = require('./loadBalancer');
responses = require('./responses');

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
Where db is the db objects allowing to access to any defined collection
and done is a callback that gives an access to the output_routes that centralize
all the possible response of the server.
*/
var input_routes = {
	"ping": function (db, done) { done('ping'); },
	"echo/(.+)": function (db, word, done) { done('echo', word); },
	"user/authent/(\\w+)/(.+)":  authent.authenticate,
	"user/create/(\\w+)/(.+)/(.+)": authent.createUser,
	"server/connect/(.+)/(.+)/(.+)": loadBalancer.newGameServer,
	"server/disconnect/(.+)/(.+)": loadBalancer.deleteGameServer,
	"(.*)": function (db, data, done) {
		console.error('Unable to find any route for input:', data);
		done('command_not_found', data);
	}
};

/*
To centralize all the answers of the server, we use an output routing
system.
When an action call `done(output, params)`, the corresponding
outout route will be matched.
Each output route is an association route / handler where the handler has
the prototype:
```
outputHandler = function (writer, param1, param2, ...) { 
	writer('write something...') 
};
```
*/
var output_routes = {
	'ping': responses.onPing,
	'echo': responses.onEcho,
	'unexpected_error': responses.onUnexpectedError,
	'invalid_secret': responses.onInvalidSecret,
	'server_registered': responses.onServerRegistered,
	'server_removed': responses.onServerRemoved,
	'user_dispatched': responses.onUserDispatched,
	'user_restricted_access': responses.onUserRestrictedAccess,
	'account_passwords_mismatch': responses.onAccountPasswordsMismatch,
	'account_created': responses.onAccountCreated,
	'account_creation_error': responses.onAccountCreationError,
	'command_not_found': responses.onCommandNotFound
}

/*
Route parser. Will call the appropriate function depending
on the route matched by `data`.
The parameter `db` will be given to the called function as its 
first parameter, the parameter `done` will be given to the called
function as its last one.
*/
exports.parseRoutes = function (db, data, writer) {
	// declare the `done` callback that will generate
	// the response from the output route called
	var done = function () {
		type = arguments[0];
		arguments[0] = writer;
		if (type in output_routes)
			output_routes[type].apply(null, arguments);
		else {
			throw Error('Output route: ' + type + ' does not exist!');
			output_routes['unexpected_error'](writer);
		}
	}
	// successively test all the routes.
	// Only the first match is executed
	for (var r in input_routes) {
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
				return input_routes[r].apply(null, params);
			}
			catch (err) {
				console.error(err)
				return done("unexpected_error");
			}
		}
	};
};