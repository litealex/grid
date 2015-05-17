var GridStore = require('../stores/GridStore');


var HeaderMixin = {
    componentDidMount: function () {
        GridStore.addChangeListeners(this._onChange, this.props.gridId);
        GridStore.addChangeListeners(this._onScroll, this.props.gridId, GridStore.EVENTS.SCROLL);
        GridStore.addChangeListeners(this._onCellUpdate, this.props.gridId, GridStore.EVENTS.CELL_UPDATE);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        GridStore.removeChangeListener(this._onScroll, this.props.gridId, GridStore.EVENTS.SCROLL);
        GridStore.removeChangeListener(this._onCellUpdate, this.props.gridId, GridStore.EVENTS.CELL_UPDATE);
    },

    _onScroll: function () {
        this.setPinStyle();
        this.node.scrollLeft = GridStore.getRealScrollLeft(this.props.gridId);
    },


    _onCellUpdate: function () {
        var newRowHeight = GridStore.getRowHeight(this.props.gridId, this.rowId);

        if (this.state.rowHeight != newRowHeight) {
            this.setState({
                rowHeight: newRowHeight
            });
        }
    },

    prevPinStyle: null,
    pinStyle: null,
    setPinStyle: function () {
        if (this.pinStyle == null) {
            this.pinStyle = document.createElement('style');
            document.head.appendChild(this.pinStyle);
        }
        var style = GridStore.getPinStyle(this.props.gridId, this.props.header);

        if (style == this.prevPinStyle) {
            return;
        }

        this.prevPinStyle = style;

        if (this.pinStyle.textContent !== undefined) {
            this.pinStyle.textContent = style;
        } else {
            this.pinStyle.innerText = style;
        }
    }
};


module.exports = HeaderMixin;