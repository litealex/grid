var React = require('react'),
    GridsStore = require('../stores/GridsStore');
function getStateFromStore(gridId) {
    return {
        height: GridsStore.getLastRowHeight(gridId)
    };
}
var LastRow = React.createClass({
    getInitialState: function () {
        return getStateFromStore(this.props.gridId)
    },
    componentDidMount: function () {
        GridsStore.addChangeListeners(this._onChange, this.props.gridId);
        GridsStore.addChangeListeners(this._onChange, this.props.gridId, GridsStore.EVENTS.V_SCROLL);
    },
    componentWillUnmount: function () {
        GridsStore.removeChangeListener(this._onChange, this.props.gridId, GridsStore.EVENTS.V_SCROLL);
    },
    render: function () {
        return (<div style={this.state} className="qtable__row qtable__row--last"></div>);
    },
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    }
});

module.exports = LastRow;