var React = require('react'),
    StylesActions = require('../actions/StylesActions'),
    GridStore = require('../stores/GridStore');


var Cell = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        var p = this.props;
        var node = this.getDOMNode();
        this.nodeStyle = node.style;
        this.content = node.querySelector('.qtable__cell__content');
    },
    componentWillUnmount: function () {
        var p = this.props;
    },
    componentDidUpdate: function () {
        var p = this.props;
    },
    render: function () {
        var cellMeta = this.props.cellMeta;
        var options = this.props.options;

        var cellClass = 'qtable__cell ' + GridStore.getColumnClassName(cellMeta.fieldId);
        var pinnedColumns = options.pinnedColumns;

        if (pinnedColumns.indexOf(cellMeta) != -1) {
            cellClass += ' qtable__cell--pin';
        }

        return (
            <div style={{height:options.rowHeight}} className={cellClass}>
                <div className="qtable__cell__content"  dangerouslySetInnerHTML={{__html: this.props.cell.value}}></div>
            </div>
        );
    },
    nodeStyle: null,
    content: null,
    _onChange: function () {
        this.nodeStyle.height = GridStore.getRowHeight(this.props.gridId, this.props.rowId) + 'px';
    }
});


module.exports = Cell;