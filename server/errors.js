
onAddressUsed = function (error) {
	console.error('Address already used', error)
};

exports.handlers = {
	'EADDRINUSE': onAddressUsed
};