var Grid = require('./components/Grid.react'),
    React = require('react'),
    StylesActions = require('./actions/StylesActions'),
    GridStore = require('./stores/GridStore');


var actions = {
    init: init,
    resize: resize
};


function init(options) {
    var $this = $(this),
        grid = <Grid rows={options.rows} header={options.header} />;
    React.render(grid, this);
    $this.data('gridId', grid.type.id);
}
function resize(w, h) {
    StylesActions.resize($(this).data('gridId'), w, h);
}

$.fn.reactGrid = function () {
    var args = arguments;

    return this.each(function () {
        var action,
            actionArgs;

        switch (typeof args[0]) {
            case 'string':
                action = args[0];
                actionArgs = Array.prototype.slice.call(args, 1);
                break;
            case 'object':
                action = 'init';
                actionArgs = args;
                break;
            default :
                throw 'Incorrect params';
                break
        }

        actions[action].apply(this, actionArgs);


    });


};


