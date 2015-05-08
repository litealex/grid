var React = require('react'),
    StylesStore = require('../stores/StylesStore');

function getStateFromStore(gridId) {
    return {
        height: StylesStore.getTopRowHeight(gridId)
    };
}


var TopRow = React.createClass({
    getInitialState: function () {
        return getStateFromStore(this.props.gridId)
    },
    componentDidMount: function () {
        StylesStore.addChangeListeners(this._onChange, this.props.gridId, StylesStore.EVENTS.V_SCROLL);
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId, StylesStore.EVENTS.V_SCROLL);
    },
    render: function () {

        return (<div style={this.state} className="qtable__row qtable__row--top"></div>);
    },

    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    }
});

module.exports = TopRow;