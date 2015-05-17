var React = require('react'),
    StylesActions = require('../actions/StylesActions'),
    GridStore = require('../stores/GridStore');


var VScroller = React.createClass({
    render: function(){
        return (
            <div className="v_scrollbar">
                <div className="v_scrollbar__holder"></div>
            </div>
        );
    }
});


module.exports = VScroller;