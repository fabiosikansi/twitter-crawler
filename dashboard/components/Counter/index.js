import React, {Component} from 'react';
import {render} from 'react-dom';
import style from './counter.scss';

export default class Counter extends React.Component {
    render() {
        var valueClasses = "value";
        if ((new String(this.props.value)).length >= 9) valueClasses += " xs";
        else if ((new String(this.props.value)).length > 5) valueClasses += " sm";
        return (
            <div className="counter">
                <span className="title">{ this.props.title }</span>
                <span className={valueClasses}>{ this.props.value }</span>
                <span className="unit">{ this.props.unit }</span>
            </div>
        );
    }
}
