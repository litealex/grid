var Dispatcher = require('./Dispatcher');
var assign = require('object-assign');

var GridDispatcher = assign({}, Dispatcher.prototype, {
        handleViewAction: function (action) {
            this.dispatch({
                source: 'VIEW_ACTION',
                action: action
            })
        }
    }
);


module.exports = GridDispatcher;