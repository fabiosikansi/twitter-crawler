'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TwitterHandler = function () {
	function TwitterHandler(db, socket) {
		var _this = this;

		_classCallCheck(this, TwitterHandler);

		this.stats = {};
		this.stats.start = (0, _moment2.default)();
		this.stats.count = 0;
		this.stats.lastMinute = [];
		this.db = db; //usar db.save(tweet).then(() => success,() => err);
		this.client = new _twitter2.default(_config2.default.twitter);
		this.info = { success: 0, error: 0 };
		this.socket = socket;

		this.client.stream('statuses/filter', { track: _config2.default.experiment.hashtags.join(",") }, function (stream) {
			console.log("Binding events...");
			stream.on('data', _this.processTweet.bind(_this));
			stream.on('error', _this.errorTweet.bind(_this));
			stream.on('error', _this.endTweet.bind(_this));
			setInterval(_this.updateStats.bind(_this), 1000);
		});
	}

	_createClass(TwitterHandler, [{
		key: 'updateStats',
		value: function updateStats() {
			this.calculateTime();
			this.calculateRate();
			this.calculateLastMinute(false);
			this.socket.broadcastStats(this.stats);
		}
	}, {
		key: 'processTweet',
		value: function processTweet(tweet) {
			var _this2 = this;

			this.stats.count++;
			if (typeof tweet.disconnect !== "undefined") {
				console.log("Disconnect");
				console.log(tweet);
			}
			this.db.save(tweet).then(function () {
				_this2.calculateLastMinute(true);
				_this2.socket.broadcastTweet(tweet);
			}, function () {
				console.log("Reject");
			});
			this.info.success++;
		}
	}, {
		key: 'errorTweet',
		value: function errorTweet(error) {
			throw error;
			terminate("Twitter error");
		}
	}, {
		key: 'endTweet',
		value: function endTweet(error) {
			throw error;
			terminate("Twitter End");
		}
	}, {
		key: 'calculateTime',
		value: function calculateTime() {
			var now = (0, _moment2.default)();
			var diff = now.diff(this.stats.start, 'minutes');
			if (diff < 60) {
				this.stats.time = (0, _moment2.default)(now.diff(this.stats.start)).format("mm:ss");
			} else {
				this.stats.time = (0, _moment2.default)(now.diff(this.stats.start)).format("HH:mm:ss");
			}
		}
	}, {
		key: 'calculateRate',
		value: function calculateRate() {
			var now = (0, _moment2.default)();
			var diff = now.diff(this.stats.start, 'seconds');
			if (diff == 0) diff = 1;
			this.stats.rate = (this.stats.count * 60 / diff).toFixed(1);
		}
	}, {
		key: 'calculateLastMinute',
		value: function calculateLastMinute(add) {
			var now = (0, _moment2.default)();
			if (add) this.stats.lastMinute.push(parseFloat(now.format('X')));
			this.stats.lastMinute = this.stats.lastMinute.filter(function (d) {
				return d > parseFloat(now.format('X')) - 60;
			});
			this.stats.lastMinuteCounter = this.stats.lastMinute.length;
		}
	}]);

	return TwitterHandler;
}();

exports.default = TwitterHandler;
