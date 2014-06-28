exports.onPing = function (writer) {
	writer('ping');
}

exports.onEcho = function (writer, word) {
	writer(word);
}

exports.onCommandNotFound = function (writer, command) {
	writer('Error: command `' + command + '\' not found.')
}

exports.onUnexpectedError = function (writer) {
	writer('An unexpected error occured, please try again');
}

exports.onInvalidSecret = function (writer) {
	writer('Invalid secret token');
}

exports.onServerRegistered = function (writer) {
	writer('Server registered!');
}

exports.onServerRemoved = function (writer) {
	writer('Server successfully removed!');
}

exports.onUserDispatched = function(writer, serverName, serverIp) {
	writer('Access/Granted/' + serverName + '/' + serverIp);
}

exports.onUserRestrictedAccess = function (writer, username) {
	writer('Access/Restricted/' + username);
}

exports.onAccountCreated = function (writer, username) {
	writer('Account ' + username + ' successfully created');
}

exports.onAccountPasswordsMismatch = function (writer) {
	writer('Passwords do not match, try again.');
}

exports.onAccountCreationError = function (writer, username) {
	writer('Unable to create user ' + username + '. This account may already exist');
}

