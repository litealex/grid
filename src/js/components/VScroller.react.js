var React = require('react'),
    StylesActions = require('../actions/StylesActions'),
    GridsStore = require('../stores/GridsStore');


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