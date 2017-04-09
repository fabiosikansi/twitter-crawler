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
		this.stats.lastMinuteHistory = [];
		this.stats.rateHistory = [];
		this.stats.tweetsHistory = [];
		this.stats.chart = [];
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
			this.stats.tweetsHistory.push(this.stats.count);
			if (this.stats.tweetsHistory.length > 60) {
				this.stats.tweetsHistory.shift();
			}
			this.calculateTime();
			this.calculateRate();
			this.calculateLastMinute(false);
			this.processLastMinuteChart();
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
				if (_this2.broadcastTweetDecision()) _this2.socket.broadcastTweet(tweet);
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
			//TODO: Verificar calculo quando muda o dia, ou se o problema ocorre quando passa de 1 hora
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
			var rate = (this.stats.count * 60 / diff).toFixed(1);
			this.stats.rate = (this.stats.count * 60 / diff).toFixed(1);
			this.stats.rateHistory.push(rate);
			if (this.stats.rateHistory.length > 60) {
				this.stats.rateHistory.shift();
			}
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
			this.stats.lastMinuteHistory.push(this.stats.lastMinute.length);
			if (this.stats.lastMinuteHistory.length > 60) {
				this.stats.lastMinuteHistory.shift();
			}
		}
	}, {
		key: 'processLastMinuteChart',
		value: function processLastMinuteChart() {
			var now = (0, _moment2.default)();
			var data = {},
			    chart = [];
			var max = parseInt(now.format('X'));
			this.stats.lastMinute.forEach(function (d) {
				if (typeof data[parseInt(d)] == "undefined") {
					data[parseInt(d)] = 0;
				}
				data[parseInt(d)]++;
			});

			for (var i = max - 60; i <= max; ++i) {
				if (typeof data[i] == "undefined") {
					chart.push(0);
				} else {
					chart.push(data[i]);
				}
			}

			this.stats.chart = chart;
		}
	}, {
		key: 'broadcastTweetDecision',
		value: function broadcastTweetDecision() {
			var log = Math.log10(this.stats.lastMinuteCounter);
			if (log <= 2.2) return true;
			if (log <= 3.0) return Math.random() <= 0.1;
			return Math.random() <= 0.01;
		}
	}]);

	return TwitterHandler;
}();

exports.default = TwitterHandler;
