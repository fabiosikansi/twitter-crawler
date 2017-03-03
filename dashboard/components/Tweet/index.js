import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import style from './tweet.scss';


export default class Tweet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.visible = true;
    }

    componentWillReceiveProps(nextProps) {
        // reset the timer if children are changed
        if (nextProps.children !== this.props.children) {
            this.setTimer();
            this.setState({visible: true});
        }
    }

    componentDidMount() {
        this.setTimer();
    }

    setTimer() {
        // clear any existing timer
        this._timer != null ? clearTimeout(this._timer) : null;

        // hide after `delay` milliseconds
        this._timer = setTimeout(function(){
            this.state.visible = false;
            this._timer = null;
        }.bind(this), this.props.delay);
    }

    componentWillUnmount() {
        clearTimeout(this._timer);
    }

    render() {
        return this.state.visible
            ?
            <div className="card">
                <div className="card-img">
                    <img className="card-img-left" src={this.props.tweet.user.profile_image_url} alt="" />
                </div>
                <div className="card-content">
                    <h6 className="card-title">{this.props.tweet.user.name} (@{this.props.tweet.user.screen_name}) {this.props.tweet.user.verified ? "(V)" : ""}</h6>
                    <p className="card-text">
                        {this.props.tweet.text}
                    </p>
                </div>
            </div>
            : null;
    }
}

