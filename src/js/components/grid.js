var React = require('react'),
    Header = require('./header'),
    Body = require('./body'),
    $ = require('jquery'),
    StylesStore = require('../stores/StylesStore'),
    StylesActions = require('../actions/StylesActions'),
    GridActions = require('../actions/GridActions');


var Grid =
    React.createClass({
        statics: {
            id: 0,
            getNextId: function () {
                return ++this.id;
            }
        },
        _resize: function(){
            var $grid = $(this.getDOMNode());
            var $parent = $grid.parent();

            StylesActions.resize(this.gridId, $parent.width());
        },
        componentDidMount: function () {
            $(window).on('resize', this._resize.bind(this));
            this._resize();
        },

        gridId: null,
        componentWillMount: function () {
            this.gridId = Grid.getNextId();
        },
        render: function () {
            var gridClass = 'qtable ' + StylesStore.getGridClassName(this.gridId);
            return (
                <div className={gridClass}>
                    <Header gridId={this.gridId} header={this.props.header} />
                    <Body gridId={this.gridId} header={this.props.header} rows={this.props.rows}/>
                </div>)
        }
    });


module.exports = Grid;