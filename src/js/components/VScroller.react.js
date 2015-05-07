var React = require('react'),
    StylesActions = require('../actions/StylesActions'),
    StylesStore = require('../stores/StylesStore');


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