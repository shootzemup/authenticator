// node module imports
var net = require('net')
// custom module imports
require('./conf')
var serverErrors = require('./server/errors');

conf.debug('Creating server...')
var server = net.createServer();

server.listen(conf.net.port, conf.net.host, function (e) {
	conf.debug('Server listening on ', server.address().address, ':', server.address().port);
});

server.on('connection', function(socket) {
	socket.setEncoding('utf8');
    
    conf.debug('CONNECTED: ', socket.remoteAddress, ':', socket.remotePort);
    // Add a 'data' event handler to this instance of socket
    socket.on('data', function(data) {
        conf.debug('DATA ', socket.remoteAddress, ': ', data);
        // Write the data back to the socket, the client will receive it as data from the server
        socket.write('You said "' + data + '"');
    });
    
    // Add a 'close' event handler to this instance of socket
    socket.on('close', function(data) {
        conf.debug('CLOSED: ', socket.remoteAddress, ' ', socket.remotePort, 'data=', data);
    });
    
});

server.on('error', function (e) {
	serverErrors[e.code](e);
});