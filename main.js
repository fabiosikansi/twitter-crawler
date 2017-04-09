import config from "./config";
import Socket from "./socket/socket-compiled";
import db from "./crawler/database-compiled";
import TwitterHandler from "./crawler/crawler-compiled"
import http from 'http';
import express from 'express';
import io from 'socket.io';

let app = express();
let alerts = [];
app.server = http.createServer(app);
let socket = io(app.server);

app.use(express.static('public'));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.get('/alerts', function(req, res){
	res.send(alerts);
});
app.get('/index.js', function(req, res){
	res.sendFile(__dirname + '/index.js');
});
app.use('/css', express.static(__dirname + '/css'));

//start crawler
db.connect().then((database) => {
	app.server.listen(config.dashboard.port);
	let SocketHandler = new Socket(socket);
	console.log("Server running on port " + config.dashboard.port);

	new TwitterHandler(database,SocketHandler);
},(database,err) => {
	app.server.listen(config.dashboard.port);
	console.log("Server running on port " + config.dashboard.port);
	let SocketHandler = new Socket(socket);
	alerts.push({"title": "Database not connected!", "type": "danger","message": "Dashboard demo! Your data is not being saved to any destination"});
	new TwitterHandler(database,SocketHandler);
});
