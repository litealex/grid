var React = require('react'),
    GridStore = require('../stores/GridStore')
StylesStore = require('../stores/StylesStore');


var HScroller = React.createClass({
    render: function () {
        return (
            <div className="h_scrollbar">
                <div className="h_scrollbar__holder"></div>
            </div>);
    }
});


module.exports = HScroller;