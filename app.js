// node module imports
var net = require('net')
// custom module imports
require('./conf')
var serverErrors = require('./server/errors');
var router = require('./server/router');

conf.debug('Creating server...')
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
        router.parseRoutes(socket, data);
    });
    
    // Add a 'close' event handler to this instance of socket
    socket.on('close', function(data) {
        conf.debug('CLOSED: ', socket.remoteAddress, ' ', socket.remotePort, 'data=', data);
    });
    
});

// function called on error
server.on('error', function (e) {
	if (e.code in serverErrors)
		serverErrors.errorHandlers[e.code](e);
	else
		serverErrors.errorHandlers['DEFAULT'](e);
});