import axios from 'axios';

export function addAlert(alert) {
    return {
        type: 'ADD_ALERT',
        data: alert
    }
}

export function getAlerts(dispatch) {
    return axios.get("/alerts").then((res) => dispatch(resolvedGetAlerts(res.data)));
}

export function resolvedGetAlerts (alerts) {
    return {
        type: 'GET_ALERTS',
        data: alerts
    }
}