'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _websocket = require('websocket');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
	function Socket(server) {
		_classCallCheck(this, Socket);

		this.server = server;
		this.lastStatsBroadcast = 0;
	}

	_createClass(Socket, [{
		key: 'broadcastStats',
		value: function broadcastStats(stats) {
			//const now = moment();
			//if (now.diff(this.lastStatsBroadcast,'seconds') > 2) {
			this.server.emit('new stats', stats);
			//this.lastStatsBroadcast = now;
			//}

		}
	}, {
		key: 'broadcastTweet',
		value: function broadcastTweet(tweet) {
			this.server.emit('new tweet', tweet);
		}
	}, {
		key: 'broadcastAlert',
		value: function broadcastAlert(alert) {
			this.server.emit('new alert', alert);
		}
	}]);

	return Socket;
}();

exports.default = Socket;
