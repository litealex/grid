var Cell = require('../components/Cell.react');

var CellsProvider = {
    _providers: [],
    add: function (provider) {
        if (this._providers.indexOf(provider) == -1)
            this._providers.push(provider)
    },
    remove: function (provider) {
        this._providers.splice(this._providers.indexOf(provider), 1);
    },
    getCell: function (options) {
        for (var i = 0; i < this._providers.length; i++) {
            var cell = this._providers[i](options);
            if (cell)
                return cell;
        }
        return Cell;
    }
};

module.exports = CellsProvider;