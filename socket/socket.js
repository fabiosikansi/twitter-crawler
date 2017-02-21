import {server} from 'websocket';
import http from 'http';
import io from 'socket.io';
import moment from 'moment';

export default class Socket {
	constructor (server) {
		this.server = server;
		this.lastStatsBroadcast = 0;
	}

	broadcastStats (stats) {
		//const now = moment();
		//if (now.diff(this.lastStatsBroadcast,'seconds') > 2) {
			this.server.emit('new stats',stats);
			//this.lastStatsBroadcast = now;
		//}


	}

	broadcastTweet (tweet) {
		this.server.emit('new tweet', tweet);
	}

	broadcastAlert (alert) {
		this.server.emit('new alert', alert);
	}
}
