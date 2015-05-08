var React = require('react'),
    Header = require('./Header.react'),
    Body = require('./Body.react'),
    HScroller = require('./HScroller.react'),
    $ = require('jquery'),
    StylesStore = require('../stores/StylesStore'),
    StylesActions = require('../actions/StylesActions'),
    GridActions = require('../actions/GridActions'),
    VScroller = require('./VScroller.react');


var Grid =
    React.createClass({
        statics: {
            id: 0,
            getNextId: function () {
                return ++this.id;
            }
        },
        componentDidMount: function () {
            $(window).on('resize', this._resize.bind(this));
            this._resize();
        },


        componentWillReceiveProps: function (nextProps) {
            GridActions.update(this.gridId, nextProps.header, nextProps.rows);
        },
        gridId: null,
        componentWillMount: function () {
            this.gridId = Grid.getNextId();
        },
        render: function () {
            var gridClass = 'qtable ' + StylesStore.getGridClassName(this.gridId);
            return (
                <div className="qtable__wrapper">

                    <div className={gridClass}>
                        <Header gridId={this.gridId} />
                        <Body gridId={this.gridId} />
                        <HScroller gridId={this.gridId} />
                    </div>
                </div>)
        },
        _resize: function () {
            var $grid = $(this.getDOMNode());
            var $parent = $grid.parent();
            StylesActions.resize(this.gridId, $parent.width());
        },
    });


module.exports = Grid;