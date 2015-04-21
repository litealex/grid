var GridDispatcher = require('../dispatcher/GridDispatcher');
var EventEmitter = require('events').EventEmitter;
var GridConstants = require('../constants/GridConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

function pinColumn() {
    console.log(arguments);
}

var HeaderStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },
    addChangeListeners: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    dispatcherIndex: GridDispatcher.register(function (payload) {
        var action = payload.action;
        switch (action.actionType) {
            case GridConstants.PIN_COLUMN:
                pinColumn(action);
                HeaderStore.emitChange();
                break;
        }
        return true;
    })
});


module.exports = HeaderStore;

