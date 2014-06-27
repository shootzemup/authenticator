
onAddressUsed = function (error) {
	console.error('Address already used', error);
};

defaultError = function (error) {
	console.error('An unexpected error occured: ', error);
}

exports.errorHandlers = {
	'EADDRINUSE': onAddressUsed,
	'DEFAULT': defaultError
};