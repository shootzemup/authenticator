conf = {
	net: {
		host: 'localhost',
		port: 8000,
		mongoUrl: 'mongodb://localhost:27017/shootzemup'
	},
	// WARNING: Changing any of the following parameters 
	// will all the already existing users not authenticable anymore.
	// conclusion: once in production, DO NOT CHANGE these parameters.
	crypto: {
		hash_algo: 'sha256',
		digest: 'base64',
		salt_len: 64
	},
	DEBUG: true,
	debug: function () { 
		if (!conf.DEBUG)
			return 
		process.stdout.write('DEBUG: ');
		console.log.apply(console, arguments);
	},
};
