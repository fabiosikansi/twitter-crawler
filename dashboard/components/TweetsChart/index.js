import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import ChartistGraph from 'react-chartist';
import style from './tweetschart.scss';

export default class TweetsChart extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var chartOptions = {
            axisX : {
                showGrid: false
            },
            axisY : {
                onlyInteger: true
            },
            height: "100%"
        };
        return (
            <div>
                <h1>Frequency:</h1>
                <div className="frequency_chart">
                    <ChartistGraph data={this.props.data} options={chartOptions} type={'Bar'} />
                </div>
            </div>
        );
    }
}
