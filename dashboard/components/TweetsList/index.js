import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import Tweet from './../Tweet';
import style from './tweetlist.scss';

export default class TweetsList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Sample of tweets:</h1>
                <div>
                    {this.props.tweets.map((tweet,key) =>
                        <Tweet delay="3000" tweet={tweet} key={key} />
                    )}
                </div>
            </div>
        );
    }
}
