var Dispatcher = require('./Dispatcher');
var assign = require('object-assign');

var GridDispatcher = assign({}, Dispatcher.prototype, {
        handleViewAction: function (action) {
            if (action.gridId == null)
                throw 'Необходимо указать gridId (' + JSON.stringify(action) + ')';

            this.dispatch({
                source: 'VIEW_ACTION',
                action: action
            })
        }
    }
);


module.exports = GridDispatcher;