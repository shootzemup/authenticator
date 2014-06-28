authenticator
=============

Manage user's authentication

## Requirements

Here are the mandatory requirements to run the application:
* nodejs version >= 0.10.29. [Download here](http://nodejs.org/download/)

## Usage: 

To run the application, simply run the following command in the shell. 
```
node app.js
```
The application will then listen to for incomming requests.

To test the application, try running a telnet command:
```
romain@romain-laptop:~/.ssh$ telnet localhost 8000
Trying ::1...
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
> user/create/hiestaa/pass/pass
Account hiestaa successfully created!
> server/connect/server1/11.11.11.11/secret_token_ignored_in_debug
Server registered!
> server/connect/server2/99.99.99.99/secret_token_ignored_i_said!
Server registered!
> user/authent/hiestaa/pa
Restricted access: unknown user `hiestaa' or invalid password.
> user/authent/hiestaa/pass
Access/server2/99.99.99.99
> user/authent/hiestaa/pass
Access/server1/11.11.11.11
> user/authent/hiestaa/pass
Access/server2/99.99.99.99
```
See the application log for more info.

## Available commands:

### Debug commands
* `ping`: the server will simply answer `ping`.
* `echo/<text>`: the server will simply answer the given text.

### User-related commands
* `user/create/<username>/<password>/<password>`: create a new user on the server. The server should answer `Account <username> successfully created` if everything goes well.
* `user/authent/<username>/<password>`: authenticate the given user on the server. If the user is authenticated, a game server will be assigned. The server should answer `Access/<server name>/<server ip>` if everything goes well.

### GameServers-related commands
* `server/connect/<server name>/<server ip>/<secret token>`: register a new game server on the authenticating server. Users can now be dispatched to this new game server. Note: Secret token is not checked in debug mode.
* `server/disconnect/<server ip>/<secret token>`: notify the authenticating server that the game server at this ip will not take any new incomming connection. It will be deleted from the database.


## Workflow
![Authenticator flowchart](https://raw.githubusercontent.com/shootzemup/authenticator/master/doc/flowchart.png)

## TODOs:
* Generate a unique token sent to an authenticated client AND to the assigned server, so that the game server will be sure that an new client is properly identified.
* Suggestion: encrypt the communications between client and server or not? 