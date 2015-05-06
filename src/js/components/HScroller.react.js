var React = require('react'),
    StylesActions = require('../actions/StylesActions'),
    StylesStore = require('../stores/StylesStore'),
    GridStore = require('../stores/GridStore');

function getStateFromStore(gridId) {
    return {
        left: StylesStore.getScrollLeft(gridId),
        width: StylesStore.getScrollWidth(gridId),
        holderWidth: StylesStore.getHolderWidth(gridId)
    };
}


var HScroller = React.createClass({
    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    componentDidMount: function () {
        var self = this;
        GridStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(this._onChange, this.props.gridId);
        StylesStore.addChangeListeners(function () {
            self.setState({left: StylesStore.getScrollLeft(self.props.gridId)});
        }, this.props.gridId, StylesStore.EVENTS.SCROLL)
    },
    componentWillUnmount: function () {
        StylesStore.removeChangeListener(this._onChange, this.props.gridId);
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        StylesStore.removeChangeListener(this._onChange, this.props.gridId, StylesStore.EVENTS.SCROLL)
    },
    componentDidUpdate: function (props, state) {

        if (this.state.drag) {
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);
        } else {
            document.removeEventListener('mousemove', this._onMouseMove);
            document.removeEventListener('mouseup', this._onMouseUp);
        }
    },
    render: function () {
        var holderStyle = {
            left: this.state.left,
            width: this.state.holderWidth
        };
        var scrollbarStyle = {width: this.state.width};
        return (
            <div style={scrollbarStyle} className="h_scrollbar">
                <div onMouseDown={this._onMouseDown} style={holderStyle} className="h_scrollbar__holder"></div>
            </div>);
    },
    _onMouseDown: function (e) {
        var leftOfsset = e.target.offsetLeft;
        this.setState({
            drag: true,
            startLeft: e.pageX,
            startLeftHolder: this.state.left
        });
        e.preventDefault();
    },
    _onMouseUp: function (e) {
        this.setState({
            drag: false
        });
        e.preventDefault();
    },
    _onMouseMove: function (e) {
        if (this.state.drag) {
            this.setState({
                left: this.state.startLeftHolder + e.pageX - this.state.startLeft
            });
            StylesActions.hScroll(this.props.gridId, this.state.startLeftHolder + e.pageX - this.state.startLeft);
        }
        e.preventDefault();
    },
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
    }
});


module.exports = HScroller;