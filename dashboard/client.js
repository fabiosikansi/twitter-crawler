import React, {Component} from 'react';
import {render} from 'react-dom';
import io from 'socket.io-client';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './reducers';
import TwitterApp from './structure/TwitterApp';
import initSocket from './socket';
import * as alertsActions from './actions/alerts';

const initialState = {
    stats: {},
    configuration: {},
    alerts: [],
    tweets: []
};

let store = createStore(App,initialState);
initSocket(store);

render(
        <Provider store={store}>
            <TwitterApp />
        </Provider>,
    document.getElementById('app')
);
