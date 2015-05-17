var GridStore = require('../stores/GridStore');


var StylesMixin = {
    componentDidMount: function () {
        GridStore.addChangeListeners(this._setStyle, this.gridId);
    },
    componentWillUnmount: function () {
        document.head.removeChild(this.style);
    },
    style: null,
    _setStyle: function () {
        var style;

        if (this.style == null) {
            this.style = document.createElement('style');
            document.head.appendChild(this.style);
        }

        style = GridStore.getStyle(this.gridId);

        // ff / all browser
        if (this.style.textContent !== undefined) {
            this.style.textContent = style;
        } else {
            this.style.innerText = style;
        }
    }
};


module.exports = StylesMixin;