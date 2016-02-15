define([
    'highland'
], function (
    hl
) {

    var emitter, input, keydown, keyup, state, time;

    function Emitter(element) {
        this.eventIterator = this.eventIterator || 0;
        this.listeners = [];
        return {
            on: function (eventName, listener) {
                this.listeners.push({
                    id: eventName + this.eventIterator++,
                    name: eventName,
                    fn: listener.bind(this)
                });
                element.addEventListener(eventName, listener);
            }.bind(this),
            off: function (eventName) {
                this.listeners.forEach(function (listener) {
                    if (listener.id === eventName || listener.name === eventName) {
                        element.removeEventListener(eventName, listener.fn);
                    }
                });
            }.bind(this)
        }
    }

    function filterRepeats(evt) {
        var change = (evt.type === 'keydown' ? 1 : 0);
        return (change !== state);
    }

    function mapEvents(evt) {
        var duration, now, result;
        now = new Date().getTime();
        duration = now - time;
        time = now;
        result = {
            state: state,
            duration: duration,
            time: now
        };
        state = (evt.type === 'keydown' ? 1 : 0);
        return result;
    }

    state = 0;
    time = new Date().getTime();
    emitter = new Emitter(document);

    keydown = hl('keydown', emitter);
    keyup = hl('keyup', emitter);
    input = hl([keydown, keyup]).merge().map(mapEvents);

    input.each(function (inp) {
        if (inp.state) {
            console.log(inp.duration);

        }
    });

    function Input() {
        // TODO: Once this works, abstract it into a configurable constructor
    }

    return Input;
});
