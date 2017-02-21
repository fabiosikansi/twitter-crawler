"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require("mongodb");

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
	function Database(db) {
		_classCallCheck(this, Database);

		this.db = db;
	}

	_createClass(Database, [{
		key: "save",
		value: function save(object) {
			return !this.db ? new Promise(function (resolve, reject) {
				return resolve(false);
			}) : this.db.collection(_config2.default.db.collection).insertOne(object);
		}
	}]);

	return Database;
}();

var connect = function connect() {
	return new Promise(function (resolve, reject) {
		console.log("Connecting to " + _config2.default.db.url);
		_mongodb.MongoClient.connect(_config2.default.db.url).then(function (db) {
			return resolve(new Database(db));
		}, function (err, db) {
			console.log(err);
			reject(new Database(false), err);
		});
	});
};

var close = function close(db) {
	if (db) {
		db.close();
	}
};

var db = {
	connect: connect,
	close: close
};

exports.default = db;
