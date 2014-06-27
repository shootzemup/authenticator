conf = {
	net: {
		host: 'localhost',
		port: 8000,
		mongoUrl: 'mongodb://localhost:27017'
	},
	DEBUG: true,
	debug: function () { 
		if (!conf.DEBUG)
			return 
		process.stdout.write('DEBUG: ');
		console.log.apply(console, arguments);
	},
};
