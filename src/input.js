define([
    'highland',
    'src/emitter'
], function (
    hl,
    Emitter
) {
    function filterRepeats(evt) {
        var change = (evt.type === this.startEventName ? 1 : 0);
        return (change !== this.state);
    }

    function mapEvents(evt) {
        var duration, now, state;

        now = evt.timeStamp;
        state = this.state;
        duration = now - this.time;
        this.time = now;
        this.state = (evt.type === this.startEventName ? 1 : 0);

        return {
            state: state,
            duration: duration
        };
    }

    function Input(config) {
        var input, interrupt, start, stop;

        config = config || {};
        this.startEventName = config.startEventName;
        this.stopEventName = config.stopEventName;

        this.state = 0;
        this.time = new Date().getTime();
        this.emitter = new Emitter(config.element);

        start = hl(this.startEventName, this.emitter);
        stop = hl(this.stopEventName, this.emitter);

        this.stream = hl([start.fork(), stop.fork()]).merge()
            .filter(filterRepeats.bind(this))
            .map(mapEvents.bind(this));
    }

    return Input;
});
