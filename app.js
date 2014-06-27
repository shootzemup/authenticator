// node module imports
var net = require('net')
var MongoClient = require('mongodb').MongoClient
// custom module imports
require('./conf')
var serverErrors = require('./actions/errors');
var router = require('./actions/router');
var models = require('./models/init');

conf.debug('Connecting to mongodb server...');
MongoClient.connect(conf.net.mongoUrl, {native_parser: true}, function (err, db) {
	if (err) throw err;
	conf.debug("Successfully connected to mongodb server.")
	models.initialize(db, function () {
		conf.debug("Successfully initalized models.");

		conf.debug('Creating server...');
		var server = net.createServer();

		// server starts listening
		server.listen(conf.net.port, conf.net.host, function (e) {
			conf.debug('Server listening on ', server.address().address, ':', server.address().port);
		});

		// function called once a connection has successfully been established
		server.on('connection', function(socket) {
			socket.setEncoding('utf8');
		    
		    conf.debug('CONNECTED: ', socket.remoteAddress, ':', socket.remotePort);
		    // Add a 'data' event handler to this instance of socket
		    socket.on('data', function(data) {
		        router.parseRoutes(db, data, function (output) {
		        	// called once the route is found and the request
		        	// is completely processed.
		        	socket.write(output, 'utf8');
		        	socket.write('\n')
		        });
		    });
		    
		    // Add a 'close' event handler to this instance of socket
		    socket.on('close', function(data) {
		        conf.debug('CLOSED');
		    });
		    
		});

		// function called on error
		server.on('error', function (e) {
			if (e.code in serverErrors)
				serverErrors.errorHandlers[e.code](e);
			else
				serverErrors.errorHandlers['DEFAULT'](e);
		});
	});
});