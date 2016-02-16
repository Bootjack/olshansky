define([
    'highland',
    'src/mapping'
], function (
    hl,
    mapping
) {

    var SIG = mapping.signals;

    function average (arr) {
        return arr.reduce(function (avg, val) {
            return avg + val / arr.length;
        }, 0);
    }

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
        if (!repeat) {
            this.interruptTimeout = setTimeout(periodicInterrupt.bind(this, true), 9 * this.cadence);
        }
    }

    function mapToMorse(inp) {
        var length, signal;
        length = inp.duration / this.cadence;
        if (length < 2) {
            signal = (inp.state ? SIG.dit.mark : SIG.dit.rest);
            confidence = Math.min(1, Math.max(0.5, Math.abs(length - inp.duration) / this.cadence));
        } else if (length < 5) {
            signal = (inp.state ? SIG.dah.mark : SIG.dah.rest);
            confidence = Math.min(1, Math.max(0.5, Math.abs(length - inp.duration) / (3 * this.cadence)));
        } else {
            signal = SIG.break.line;
            confidence = 1;
        }
        return {
            value: signal,
            confidence: confidence
        };
    }

    function updateCadence(batch) {
        var avgs, bins, cadence, count, dit, dah, doh, mean, redux, start;

        cadence = this.cadence;
        count = 50;
        bins = [];
        start = {
            min: Infinity,
            max: 0,
            sum: 0
        };

        while (count > 0) {
            count -= 1;
            bins.push([]);
        }

        batch = batch.filter(function (inp) {
            return inp.duration < cadence * 10 && inp.duration > 0.25 * cadence;
        });

        redux = batch.reduce(function (result, inp, i, arr) {
            var duration = Math.max(0, inp.duration);
            result.min = Math.min(result.min, inp.duration);
            result.max = Math.max(result.max, inp.duration);
            result.sum += inp.duration;
            return result;
        }, start);

        redux.range = redux.max - redux.min;
        redux.mean = redux.sum / redux.range;

        batch.sort().forEach(function (inp, i) {
            var index, relative;
            relative = (inp.duration - redux.min) / redux.range;
            index = Math.floor(relative * (bins.length - 1));
            bins[index].push(inp.duration);
        });

        bins = bins.map(function (bin) {
            return {
                count: bin.length,
                average: average(bin)
            };
        }).sort(function (a, b) {
            return a.count - b.count;
        }).slice(-3).sort(function (a, b) {
            return a.average - b.average;
        });

        cadence = bins[0].average + redux.min;
        this.cadence = Math.round(0.5 * (this.cadence + cadence));
        return this.cadence;
    }

    function Morse(config) {
        var interrupt;
        config = config || {};
        this.cadence = config.cadence || 60;
        this.interrupt = hl();
        this.interrupted = hl([config.input.fork(), this.interrupt.fork()]).merge();
        this.normalized = this.interrupted.fork().filter(normalizeLongDurations.bind(this));
        this.monitor = this.normalized.observe().batch(20).map(updateCadence.bind(this));
        this.stream = this.normalized.fork().map(mapToMorse.bind(this));
        config.input.fork().each(clearInterrupt.bind(this));
    }

    return Morse;
});
