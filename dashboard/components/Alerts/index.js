import React, {Component} from 'react';
import {render} from 'react-dom';

export default class Alerts extends React.Component {
    render() {
        return (
            <div>{this.props.alerts.map((alert,key) =>
                <div className={"alert alert-" + alert.type} key={key}>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>{alert.title}</strong> {alert.message}
                </div>)}</div>
        );
    }
}
