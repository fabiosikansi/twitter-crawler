import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import Alerts from './../components/Alerts';
import Counter from './../components/Counter';
import TweetsList from './../components/TweetsList';
import TweetsChart from './../components/TweetsChart';

class Body extends React.Component {
    render() {
        return (
            <div className="container body">
                <div className="row">
                    <div className="col-sm-12">
                        <Alerts alerts={this.props.alerts} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <Counter title="Tweets collected" unit="tweets" color="red" icon="twitter" value={this.props.stats.count} />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <Counter title="Elapsed time" unit="" color="green" icon="clock-o" value={this.props.stats.time} />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <Counter title="Crawler rate" unit="tweets per minute" color="purple" icon="tachometer" value={this.props.stats.rate} />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <Counter title="Last minute" unit="tweets" color="yellow" icon="plus-circle" value={this.props.stats.lastMinuteCounter} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-6">
                        <TweetsChart data={this.props.stats.chart} />
                    </div>
                    <div className="col-xs-12 col-md-6">
                        <TweetsList tweets={this.props.tweets} />
                    </div>
                </div>
            </div>

        );
    }
}


const mapStateToProps = (state) =>  ({
    tweets: state.tweets
});


export default connect(mapStateToProps)(Body);