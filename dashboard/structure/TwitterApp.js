import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {render} from 'react-dom';
import * as statsActions from './../actions/stats';
import * as alertsActions from './../actions/alerts';
import Menu from './../components/Menu';
import Body from './body';

class TwitterApp extends React.Component {

    constructor(props) {
        super(props);
        this.props.actions.getAlerts();
    }

    render() {
        return (
            <div>
                <Menu /><Body stats={this.props.stats} alerts={this.props.alerts} />
            </div>
        );
    }
}

const mapStateToProps = (state) =>  {
    state.stats.chart = (Array.isArray(state.stats.chart)) ? {series: [state.stats.chart]} : {series: [[]]};
    return {
        stats: state.stats,
            alerts: state.alerts
    }
};

const mapDispatchToProps = (dispatch) => ({
    actions: {
        getAlerts: () => {
            alertsActions.getAlerts(dispatch);
        }
    }
});


export default connect(mapStateToProps,mapDispatchToProps)(TwitterApp);