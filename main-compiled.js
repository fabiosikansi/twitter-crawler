"use strict";

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _socketCompiled = require("./socket/socket-compiled");

var _socketCompiled2 = _interopRequireDefault(_socketCompiled);

var _databaseCompiled = require("./crawler/database-compiled");

var _databaseCompiled2 = _interopRequireDefault(_databaseCompiled);

var _crawlerCompiled = require("./crawler/crawler-compiled");

var _crawlerCompiled2 = _interopRequireDefault(_crawlerCompiled);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var alerts = [];
app.server = _http2.default.createServer(app);
var socket = (0, _socket2.default)(app.server);

app.use(_express2.default.static('public'));
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/alerts', function (req, res) {
	res.send(alerts);
});
app.get('/index.js', function (req, res) {
	res.sendFile(__dirname + '/index.js');
});
app.use('/css', _express2.default.static(__dirname + '/css'));

//start crawler
_databaseCompiled2.default.connect().then(function (database) {
	app.server.listen(_config2.default.dashboard.port);
	var SocketHandler = new _socketCompiled2.default(socket);
	console.log("Server running on port " + _config2.default.dashboard.port);

	new _crawlerCompiled2.default(database, SocketHandler);
}, function (database, err) {
	app.server.listen(_config2.default.dashboard.port);
	console.log("Server running on port " + _config2.default.dashboard.port);
	var SocketHandler = new _socketCompiled2.default(socket);
	alerts.push({ "title": "Database not connected!", "type": "danger", "message": "Dashboard demo! Your data is not being saved to any destination" });
	new _crawlerCompiled2.default(database, SocketHandler);
});
