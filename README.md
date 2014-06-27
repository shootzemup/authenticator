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
> ping
ping
> echo/test
test
> createUser/trolilol/m0tdEp@ss/m0tdEp@ss
Account trolilol successfully created
> authent/trolilol/m0tdEp@ss
Access granted
```
See the application log for more info.
