var React = require('react'),
    Header = require('./Header.react'),
    Body = require('./Body.react'),
    HScroller = require('./HScroller.react'),
    $ = require('jquery'),
    GridStore = require('../stores/GridStore'),
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
        
        mixins: [require('../mixins/Styles.mixin')],
        componentDidMount: function () {
            $(window).on('resize', this._resize.bind(this));
            GridActions.update(this.gridId, this.props.header, this.props.rows);
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
            var gridClass = 'qtable ' + GridStore.getGridClassName(this.gridId);
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
            StylesActions.resize(this.gridId, $parent.width(), $parent.height());
        },
    });


module.exports = Grid;