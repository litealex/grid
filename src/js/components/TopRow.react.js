var React = require('react'),
    GridStore = require('../stores/GridStore');

function getStateFromStore(gridId) {
    return {
        height: GridStore.getTopRowHeight(gridId)
    };
}


var TopRow = React.createClass({
    getInitialState: function () {
        return getStateFromStore(this.props.gridId)
    },
    componentDidMount: function () {
        GridStore.addChangeListeners(this._onChange, this.props.gridId, GridStore.EVENTS.V_SCROLL);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onChange, this.props.gridId, GridStore.EVENTS.V_SCROLL);
    },
    render: function () {

        return (<div style={this.state} className="qtable__row qtable__row--top"></div>);
    },

    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    }
});

module.exports = TopRow;