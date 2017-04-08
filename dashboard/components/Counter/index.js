import React, { Component,PropTypes } from 'react';
import { Card, CardBlock, CardTitle, CardText, Badge } from 'reactstrap';
import { Sparklines, SparklinesCurve } from 'react-sparklines';
import './counter.scss';

const propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string,
    value: React.PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    percentage: React.PropTypes.oneOfType([PropTypes.number,PropTypes.bool])
};
const defaultProps = {
    title: "",
    icon: "",
    value: "",
    percentage: false,
    data: []
};

class Counter extends Component {
    render() {
        const icon = (this.props.icon.length > 0) ? (<i className={"card-icon fa fa-" + this.props.icon} />) : ("");
        const badge = (this.props.percentage === false) ? ("") : (
            (this.props.percentage > 0) ?
                (<Badge className="card-variation positive-badge hidden-xs-down"><i className="fa fa-caret-up"/> {this.props.percentage}%</Badge>) :
                (<Badge className="card-variation negative-badge hidden-xs-down"><i className="fa fa-caret-down"/> {this.props.percentage}%</Badge>)
        );
        return (
            <Card className={"counter bg-" + this.props.color}>
                <CardBlock>
                    {icon}
                    <CardTitle>{this.props.title}</CardTitle>
                    <CardText>
                        <span className="card-value-prefix">{this.props.prefix}</span>
                        <span className={"card-value " + ((new String(this.props.value).length < 6) ? "lg" : "")}>{this.props.value}</span>
                        {badge}
                    </CardText>
                    <div className="card-sparkline">
                        <Sparklines data={this.props.data} limit={15} min={0} max={21} width={100} height={20} margin={0}>
                            <SparklinesCurve color="white" />
                        </Sparklines>
                    </div>
                </CardBlock>
            </Card>
        );
    }
}

Counter.propTypes = propTypes;
Counter.defaultProps = defaultProps;

export default Counter;
