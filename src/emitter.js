define([
    'highland'
], function (
    hl
) {
    function Emitter(element) {
        this.element = element;
        this.eventIterator = this.eventIterator || 0;
        this.listeners = [];
    }

    Emitter.prototype = {
        on: function (eventName, listener) {
            this.listeners.push({
                id: eventName + this.eventIterator++,
                name: eventName,
                fn: listener.bind(this)
            });
            this.element.addEventListener(eventName, listener);
        },
        off: function (eventName) {
            this.listeners.forEach(function (listener) {
                if (listener.id === eventName || listener.name === eventName) {
                    this.element.removeEventListener(eventName, listener.fn);
                }
            }.bind(this));
        }
    }

    return Emitter;
});
