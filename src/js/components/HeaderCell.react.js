var React = require('react');
var GridStore = require('../stores/GridStore');
var StylesActions = require('../actions/StylesActions');

var HeaderCell = React.createClass({
    getInitialState: function () {
        return {left: 0};
    },
    _onPin: function (fieldId) {
        StylesActions.pinColumn(this.props.gridId, fieldId);
    },
    componentDidMount: function () {
        var p = this.props;
        var node  = this.getDOMNode();
        this.nodeStyle = node.style;

        this.content = node.querySelector('.qtable__cell__content');
        GridStore.addChangeListeners(this._onChange, p.gridId, GridStore.EVENTS.CELL_UPDATE);
        StylesActions.updateHeaderRowCellHeight(p.gridId, p.rowId, p.cell.fieldId, this.content.offsetHeight);
    },
    componentDidUpdate: function () {
        var p = this.props;
        StylesActions.updateHeaderRowCellHeight(p.gridId, p.rowId, p.cell.fieldId, this.content.offsetHeight);
    },
    render: function () {
        var style = {left: this.state.left};
        var cell = this.props.cell;
        var cellClass = 'qtable__cell ' + GridStore.getColumnClassName(cell.fieldId);
        if (this.props.options.isPinned) {
            cellClass += ' qtable__cell--pin';
        }

        return (
            <div onClick={this._onPin.bind(this, cell.fieldId)} className={cellClass}>
                <div className="qtable__cell__content"  dangerouslySetInnerHTML={{__html: cell.label}}></div>
            </div>
        )
    },
    nodeStyle: null,
    content: null,
    _onChange: function () {
        this.nodeStyle.height = GridStore.getRowHeight(this.props.gridId, this.props.rowId) + 'px';
    }

});


module.exports = HeaderCell;