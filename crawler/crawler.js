import Twitter from 'twitter';
import moment from 'moment';
import config from "../config";

export default class TwitterHandler {

	constructor(db,socket) {
		this.stats = {};
		this.stats.start = moment();
		this.stats.count = 0;
		this.stats.lastMinute = [];
		this.stats.chart = [];
		this.db = db; //usar db.save(tweet).then(() => success,() => err);
		this.client = new Twitter(config.twitter);
		this.info = {success: 0,error: 0};
		this.socket = socket;

		this.client.stream('statuses/filter', {track: config.experiment.hashtags.join(",")}, (stream) => {
			console.log("Binding events...");
			stream.on('data',this.processTweet.bind(this));
			stream.on('error',this.errorTweet.bind(this));
			stream.on('error',this.endTweet.bind(this));
			setInterval(this.updateStats.bind(this),1000);
		});
	}

	updateStats () {
		this.calculateTime();
		this.calculateRate();
		this.calculateLastMinute(false);
		this.processLastMinuteChart();
		this.socket.broadcastStats(this.stats);
	}

	processTweet(tweet) {
		this.stats.count++;
		if (typeof tweet.disconnect !== "undefined") {
			console.log("Disconnect");
			console.log(tweet);
		}
		this.db.save(tweet).then(() => {
			this.calculateLastMinute(true);
			if (this.broadcastTweetDecision()) this.socket.broadcastTweet(tweet);
		},() => {
			console.log("Reject");
		});
		this.info.success++;
	}

	errorTweet(error) {
		throw error;
		terminate("Twitter error");
	}

	endTweet(error) {
		throw error;
		terminate("Twitter End");
	}

	calculateTime () {
		//TODO: Verificar calculo quando muda o dia, ou se o problema ocorre quando passa de 1 hora
		const now = moment();
		let diff = now.diff(this.stats.start,'minutes');
		if (diff < 60) {
			this.stats.time = moment(now.diff(this.stats.start)).format("mm:ss");
		} else {
			this.stats.time = moment(now.diff(this.stats.start)).format("HH:mm:ss");
		}
	}

	calculateRate () {
		const now = moment();
		let diff = now.diff(this.stats.start,'seconds');
		if (diff == 0) diff = 1;
		this.stats.rate = (this.stats.count*60/diff).toFixed(1);
	}

	calculateLastMinute(add) {
		const now = moment();
		if (add) this.stats.lastMinute.push(parseFloat(now.format('X')));
		this.stats.lastMinute = this.stats.lastMinute.filter((d) => d > parseFloat(now.format('X'))-60);
		this.stats.lastMinuteCounter = this.stats.lastMinute.length;
	}

	processLastMinuteChart() {
		const now = moment();
		var data = {},chart=[];
		var max = parseInt(now.format('X'));
		this.stats.lastMinute.forEach((d) => {
			if (typeof data[parseInt(d)] == "undefined") {
				data[parseInt(d)] = 0;
			}
			data[parseInt(d)]++;
		});

		for (var i = max-60; i <= max; ++i) {
			if (typeof data[i] == "undefined") {
				chart.push(0);
			} else {
				chart.push(data[i]);
			}

		}

		this.stats.chart = chart;
	}

	broadcastTweetDecision() {
		var log = Math.log10(this.stats.lastMinuteCounter);
		if (log <= 2.2) return true;
		if (log <= 3.0) return Math.random() <= 0.1;
		return Math.random() <= 0.01;
	}

}
