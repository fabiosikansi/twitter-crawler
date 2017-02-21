import io from 'socket.io-client';
import * as statsActions from './actions/stats';
import * as alertsActions from './actions/alerts';
import * as tweetActions from './actions/tweets';

export default function (store) {
    const socket = io('http://localhost:8000');
    console.log("Socket initialized");

    socket.on('new stats', message => {
        store.dispatch(statsActions.updateStats(message));
    });
    socket.on('new alert', message => {
        store.dispatch(alertsActions.addAlert(message));
    });
    socket.on('new tweet', message => {
        if (typeof message.user !== "undefined")
            store.dispatch(tweetActions.newTweet(message));
        else
            console.log(message);
    });
}
