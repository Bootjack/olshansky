define([
    'highland',
    'src/mapping'
], function (
    hl,
    mapping
) {

    var SIG = mapping.signals;

    function clearInterrupt(inp) {
        clearTimeout(this.interruptTimeout);
        if (inp.state) {
            this.interruptTimeout = setTimeout(periodicInterrupt.bind(this), 4 * this.cadence);
        }
    }

    function normalizeLongDurations(inp) {
        return inp.duration < 10 * this.cadence;
    }

    function periodicInterrupt(repeat) {
        this.interrupt.write({
            state: 0,
            duration: (repeat ? 9 : 4) * this.cadence
        });
        clearTimeout(this.interruptTimeout);
        if (!repeat) {
            this.interruptTimeout = setTimeout(periodicInterrupt.bind(this, true), 9 * this.cadence);
        }
    }

    function mapToMorse(inp) {
        var length, signal;
        length = inp.duration / this.cadence;
        if (length < 2) {
            signal = (inp.state ? SIG.dit.mark : SIG.dit.rest);
        } else if (length < 5) {
            signal = (inp.state ? SIG.dah.mark : SIG.dah.rest);
        } else {
            signal = SIG.break.line;
        }
        return {
            value: signal,
            confidence: 1 // TODO: Make this a real representation of confidence
        };
    }

    function Morse(config) {
        var interrupt;
        config = config || {};
        this.cadence = config.cadence || 60;
        this.interrupt = hl();
        this.interrupted = hl([config.input.fork(), this.interrupt.fork()]).merge();
        this.normalized = this.interrupted.fork().filter(normalizeLongDurations.bind(this));
        this.stream = this.normalized.fork().map(mapToMorse.bind(this));
        config.input.fork().each(clearInterrupt.bind(this));
    }

    return Morse;
});
