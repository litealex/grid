var React = require('react');
var StylesStore = require('../stores/StylesStore');
var StylesActions = require('../actions/StylesActions');

var HeaderCell = React.createClass({
    getInitialState: function () {
        return {left: 0};
    },
    _onPin: function (fieldId) {
        StylesActions.pinColumn(this.props.gridId, fieldId);
    },
    componentDidMount: function () {
        // StylesStore.addChangeListeners(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    },
    //componentWillReceiveProps: function (props) {
    //    if (props.options.isPinned) {
    //        this.node = this.getDOMNode();
    //        StylesStore.addChangeListeners(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    //    }
    //    else {
    //        this.node = null;
    //        StylesStore.removeChangeListener(this._onScroll, this.props.gridId, StylesStore.EVENTS.SCROLL);
    //    }
    //},

    render: function () {
        var style = {left: this.state.left};
        var cell = this.props.cell;
        var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cell.fieldId);
        if (this.props.options.isPinned) {
            cellClass += ' qtable__cell--pin';
        }


        return (
            <div onClick={this._onPin.bind(this, cell.fieldId)} className={cellClass}>
                <span dangerouslySetInnerHTML={{__html: cell.label}}></span>
            </div>
        )
    },
    node: null,
    _onScroll: function () {
        //this.node.style.left = StylesStore.getRealScrollLeft(this.props.gridId) + 'px';
        //this.setState({
        //    left: StylesStore.getRealScrollLeft(this.props.gridId)
        //});
    }
});


module.exports = HeaderCell;