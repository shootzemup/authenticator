authent = require('./authenticator');

require('../conf');

/* 
Available routes. Each is an association regexp - handler.
The regexp can catch any number of groups which will be given
to the corresponding handler. It *MUST NOT* start with `^` or
end with `$` as these special characters will be automatically added
when parsing the query.
All the handlers should have the following structure:
```
myHandler = function (socket, group1, group2, ...) { do_stuff() };
```
Where socket is the current client's socket. See 
http://nodejs.org/api/net.html#net_class_net_socket for more info 
*/
var routes = {
	"ping": function (db, done) { done('ping\n'); },
	"echo/(.+)": function (db, word, done) { done(word+'\n'); },
	"authent/(\\w+)/(.+)":  authent.authenticate,
	"(.*)": function (db, data, done) {
		console.error('Unable to find any route for input:', data);
		done('error\n');
	}
};

/*
Route parser. Will call the appropriate function depending
on the route matched by `data`.
The parameter `socket` will be given to the called function as its 
first parameter.
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
			return routes[r].apply(null, params);
		}
	};
};