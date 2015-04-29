var React = require('react'),
    TopRow = require('./toprow'),
    LastRow = require('./lastrow'),
    Row = require('./row'),
    StylesStore = require('../stores/StylesStore'),
    StylesActions = require('../actions/StylesActions');


function getStateFromStore(gridId) {
    return {
        width: StylesStore.getGridWidth(gridId),
        height: StylesStore.getGridHeight(gridId)
    };
}


var Body = React.createClass({
    getInitialState: function () {
        return getStateFromStore();
    },
    componentDidMount: function () {
        StylesStore.addChangeListeners(this._onChange, this.props.gridId);

        this.getDOMNode().addEventListener('scroll', this._onScroll)
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
    },
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    },
    _onScroll: function (e) {
        StylesActions.scroll(this.props.gridId,{
            top: e.target.scrollTop,
            left: e.target.scrollLeft
        });
    },
    render: function () {
        var renderRows = null,
            rows,
            style = {
                width: this.state.width,
                height: this.state.height
            };

        if (this.props.rows.length > 100) {
            renderRows = this.props.rows.slice(0, 100);
        } else {
            renderRows = this.props.rows;
        }

        rows = renderRows.map(function (row) {
            return (<Row metadata={this.props.header} cells={row} />)
        }.bind(this));


        return (
            <div style={style} className="qtable__body">
                <TopRow></TopRow>
            {rows}
                <LastRow></LastRow>
            </div>);
    }
});

module.exports = Body;