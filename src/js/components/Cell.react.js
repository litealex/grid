var React = require('react'),
    StylesActions = require('../actions/StylesActions'),
    StylesStore = require('../stores/StylesStore');


var Cell = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        var p = this.props;
        var node = this.getDOMNode();
        this.nodeStyle = node.style;
        this.content = node.querySelector('.qtable__cell__content');
        StylesStore.addChangeListeners(this._onChange, p.gridId, StylesStore.EVENTS.CELL_UPDATE);
        StylesActions.updateRowCellHeight(p.gridId, p.rowId, p.cellMeta.fieldId, this.content.offsetHeight);
    },
    componentWillUnmount: function () {
        var p = this.props;
        StylesStore.reduceEmitChange(this._onChange, p.gridId, StylesStore.EVENTS.CELL_UPDATE);
    },
    componentDidUpdate: function () {
        var p = this.props;
        StylesActions.updateRowCellHeight(p.gridId, p.rowId, p.cellMeta.fieldId, this.content.offsetHeight);
    },
    render: function () {
        var cellMeta = this.props.cellMeta;
        var options = this.props.options;
        var cellClass = 'qtable__cell ' + StylesStore.getColumnClassName(cellMeta.fieldId);
        var pinnedColumns = options.pinnedColumns;

        if (pinnedColumns.indexOf(cellMeta) != -1) {
            cellClass += ' qtable__cell--pin';
        }

        return (
            <div className={cellClass}>
                <div className="qtable__cell__content"  dangerouslySetInnerHTML={{__html: this.props.cell}}></div>
            </div>
        );
    },
    nodeStyle: null,
    content: null,
    _onChange: function () {
        this.nodeStyle.height = StylesStore.getRowHeight(this.props.gridId, this.props.rowId) + 'px';
    }
});


module.exports = Cell;