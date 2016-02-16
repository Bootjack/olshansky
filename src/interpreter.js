
define([
    'highland'
], function (
    hl
) {

    interpreter = function() {
<<<<<<< HEAD

    }

    interpreter.buffer = [];

    interpreter.durations = [];

=======

    }

    interpreter.buffer = [];

    interpreter.durations = [];

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
    interpreter.codeMap = {
            ".-": "A",
            "-...": "B",
            "-.-.": "C",
            "-..": "D",
            ".": "E",
            "..-.": "F",
            "--.": "G",
            "....": "H",
            "..": "I",
            ".---": "J",
            "-.-": "K",
            ".-..": "L",
            "--": "M",
            "-.": "N",
            "---": "O",
            ".--.": "P",
            "--.-": "Q",
            ".-.": "R",
            "...": "S",
            "-": "T",
            "..-": "U",
            "...-": "V",
            ".--": "W",
            "-..-": "X",
            "-.--": "Y",
            "--..": "Z",
            "-----": "0",
            ".----": "1",
            "..---": "2",
            "...--": "3",
            "....-": "4",
            ".....": "5",
            "-....": "6",
            "--...": "7",
            "---..": "8",
            "----.": "9"
        };
<<<<<<< HEAD

=======

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
    interpreter.addDuration = function(state, duration) {

        this.buffer.push({state: state, duration: duration});
        if(this.durations.length != 0 || state != 0) {
            this.calcDurations(state, duration);
        }
        console.log(this.durations);
        this.interpret(this.durations);
    }
<<<<<<< HEAD

=======

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
    interpreter.calcDurations = function(state, duration) {
        this.durations.push(duration);
    }

    // data is a list of integers where the first integer is the length of time on
    // and the next integer is the length of time off, and so on.
    interpreter.interpret = function(data) {
        var ons = data.filter(
            function(item, index){
                return (index % 2 == 0);
            });
        var offs = data.filter(
            function(item, index){
                return (index % 2 == 1);
            });

        //console.log(ons);
        //console.log(offs);
<<<<<<< HEAD

        var dotThreshold;
        if(ons.length < 10) {
            dotThreshold = 100;
        } else {
            dotThreshold = this.findOnGroups(ons);
        }

        var offThresholds;
        if(offs.length < 60) {
            offThresholds = [];
            offThresholds.push(dotThreshold * 1.07);
            offThresholds.push(dotThreshold * 1.25);
        } else {
            offThresholds = this.findOffGroups(offs);
        }

        console.log(offThresholds);

=======

        var dotThreshold;
        if(ons.length < 10) {
            dotThreshold = 100;
        } else {
            dotThreshold = this.findOnGroups(ons);
        }

        var offThresholds;
        if(offs.length < 60) {
            offThresholds = [];
            offThresholds.push(dotThreshold * 1.07);
            offThresholds.push(dotThreshold * 1.25);
        } else {
            offThresholds = this.findOffGroups(offs);
        }

        console.log(offThresholds);

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        var fudgeFactor = 0.9;
        var signals = [];
        for(var i = 0; i < data.length; ++i) {
            if(i % 2 == 0) {
                // interpreting sound
                if(data[i] > 3 * dotThreshold * fudgeFactor) {
                    signals.push("-");
                } else {
                    signals.push(".");
                }
            } else {
                if(data[i] >= offThresholds[1] * 7 * fudgeFactor) {
                    signals.push("wordbreak");
                } else if(data[i] >= offThresholds[1]* 3 * fudgeFactor){
                    signals.push("charbreak");
                }
                // interpreting silence
            }
        }
        console.log(this.signalsPrettyPrint(signals));
        return this.translateDitsDashes(signals);
    }

    interpreter.findOnGroups = function(ons) {
        // possible that we only actually have one group of symbols (only dits or dashes)

        // find distance from one point to other points
        // put the distances into bins
        // find maximal groupings that minimize distance of like points



        var sortedOns = ons.sort(
            function comp(a, b){
                return a - b;
            }); // ascending
<<<<<<< HEAD

=======

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        var range = sortedOns[sortedOns.length - 1] - sortedOns[0];
        maxBins = 50;
        var bins = [];
        for(var i=0; i < maxBins; ++i) {
            bins[i] = 0;
        }
        sortedOns.forEach(function(entry){
            index = Math.floor((entry - sortedOns[0]) * maxBins / range);
            if( index > maxBins - 1) {
                index = maxBins - 1;
            }
            ++bins[index];
        });
<<<<<<< HEAD

=======

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        var mval = 0;
        var maxCount = bins[0];
        for(var i = 1; i < maxBins; ++i) {
            if(bins[i] > maxCount) { maxCount = bins[i]; }
            mval += Math.abs(bins[i] - bins[i-1]);
        }
        mval /= maxCount;
<<<<<<< HEAD


=======


>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        var binRecs = [];
        bins.forEach(function(entry, index){
            binRecs.push({index: index, count: entry});
        });
        binRecs.sort(function(a, b){
            return b.count - a.count; //desc
        });
<<<<<<< HEAD

        //console.log(bins);
        //console.log("mval: " + mval);

        //console.log(sortedOns);
        //console.log(deltas);

=======

        //console.log(bins);
        //console.log("mval: " + mval);

        //console.log(sortedOns);
        //console.log(deltas);

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        var thresholds = [];
        thresholds.push( (sortedOns[0] + (range * binRecs[0].index/ maxBins)) );
        thresholds.push( (sortedOns[0] + (range * binRecs[1].index/ maxBins)) );
        thresholds.push( (sortedOns[0] + (range * binRecs[2].index/ maxBins)) );
        thresholds.sort(function(a, b){
            return a - b; // asc
        });
        thresholds.splice(1, 2); // keep the lowest threshold since it (probably) indicates a .
        return thresholds[0];

    }

    interpreter.findOffGroups = function(offs) {
        var sortedOffs = offs.sort(
            function comp(a, b){
                return a - b;
            }); // ascending

        // remove anything over 5 seconds since this is probably not part of the "normal" input.
        while(sortedOffs[sortedOffs.length - 1] > 5000) {
            sortedOffs.splice(sortedOffs.length - 1, 1);
        }

        var countTopPercentile = Math.floor(sortedOffs.length * 0.09);
        if(countTopPercentile > 0) {
            sortedOffs.splice(sortedOffs.length - countTopPercentile, countTopPercentile);
        }

<<<<<<< HEAD
        // remove anything over 5 seconds since this is probably not part of the "normal" input.
        while(sortedOffs[sortedOffs.length - 1] > 5000) {
            sortedOffs.splice(sortedOffs.length - 1, 1);
        }

        var countTopPercentile = Math.floor(sortedOffs.length * 0.09);
        if(countTopPercentile > 0) {
            sortedOffs.splice(sortedOffs.length - countTopPercentile, countTopPercentile);
        }

        var range = sortedOffs[sortedOffs.length - 1] - sortedOffs[0];
        maxBins = 100;
        var bins = [];
        for(var i=0; i < maxBins; ++i) {
            bins[i] = 0;
        }
=======
        var range = sortedOffs[sortedOffs.length - 1] - sortedOffs[0];
        maxBins = 100;
        var bins = [];
        for(var i=0; i < maxBins; ++i) {
            bins[i] = 0;
        }
>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        sortedOffs.forEach(function(entry){
            index = Math.floor((entry - sortedOffs[0]) * maxBins / range);
            if( index > maxBins - 1) {
                index = maxBins - 1;
            }
            ++bins[index];
        });
<<<<<<< HEAD

=======

>>>>>>> Import dynamic cadence adjustment and lean up interrupt timings
        var mval = 0;
        var maxCount = bins[0];
        for(var i = 1; i < maxBins; ++i) {
            if(bins[i] > maxCount) { maxCount = bins[i]; }
            mval += Math.abs(bins[i] - bins[i-1]);
        }
        mval /= maxCount;

        var binRecs = [];
        bins.forEach(function(entry, index){
            binRecs.push({index: index, count: entry});
        });
        binRecs.sort(function(a, b){
            return b.count - a.count; //desc
        });
        //console.log("range: " + range + " min: " + sortedOffs[0] + " max: " + (sortedOffs[0] + range) + " maxBins: " + maxBins);
        //console.log("mode[0]: " + binRecs[0].count + " at " + binRecs[0].index + " " + (sortedOffs[0] + (range * binRecs[0].index/ maxBins)) );
        //console.log("mode[1]: " + binRecs[1].count + " at " + binRecs[1].index + " " + (sortedOffs[0] + (range * binRecs[1].index/ maxBins)) );
        //console.log("mode[2]: " + binRecs[2].count + " at " + binRecs[2].index + " " + (sortedOffs[0] + (range * binRecs[2].index/ maxBins)) );

        var thresholds = [];
        thresholds.push( (sortedOffs[0] + (range * binRecs[0].index/ maxBins)) );
        thresholds.push( (sortedOffs[0] + (range * binRecs[1].index/ maxBins)) );
        thresholds.push( (sortedOffs[0] + (range * binRecs[2].index/ maxBins)) );
        thresholds.sort(function(a, b){
            return a - b; // asc
        });
        thresholds.splice(0, 1); // remove the smallest threshold since that indicates gap between characters (probably).

        //console.log(bins);
        //console.log("mval: " + mval);
        return thresholds;
    }

    // signals is a list that can only contain certain values: ".", "-", "charbreak", "wordbreak"
    interpreter.translateDitsDashes = function(signals) {
        var message = '';
        while(signals.length > 0) {
            var messageChar = this.extractCharacter(signals);
            if(messageChar) {
                message += messageChar;
            } else {
                message += "<?>";
                var cbIndex = signals.indexOf("charbreak");
                var wbIndex = signals.indexOf("wordbreak");
                var index = 0;
                if(cbIndex == -1) {
                    index = wbIndex;
                } else if(wbIndex == - 1) {
                    index = cbIndex;
                } else {
                    index = Math.min(cbIndex, wbIndex);
                }
                if(index == -1) break;
                signals.splice(0, index);
            }
        }
        console.log(message);
        return message;
    }

    // signals is a list that can only contain certain values: ".", "-", "charbreak", "wordbreak"
    interpreter.extractCharacter = function(signals) {
        if(signals[0] =='wordbreak') {
            signals.splice(0, 1);
            return ' ';
        }
        while(signals[0] == 'charbreak' || signals[0] == 'wordbreak'){
            signals.splice(0, 1);
        }
        var cbIndex = signals.indexOf("charbreak");
        var wbIndex = signals.indexOf("wordbreak");

        var charEnd = 0;
        if(cbIndex == -1) {
            charEnd = wbIndex;
        } else if(wbIndex == -1) {
            charEnd = cbIndex;
        } else {
            charEnd = Math.min(wbIndex, cbIndex);
        }
        if(charEnd == -1) {
            charEnd = signals.length;
        }
        var code = '';
        for(var i = 0; i < charEnd; ++i) {
            code += signals[i];
        }

        var decodedChar = this.codeMap[code];
        if(decodedChar){
            //console.log(decodedChar);
            signals.splice(0, code.length);
            return decodedChar;
        }

        // no match.  some possible actions: throw away the leading signal and try to extract
        // something.  throw some sort of error and let the caller figure out what to do.
        return null;

    }

    interpreter.signalsPrettyPrint = function(signals) {
        var str = '';
        signals.forEach(function(entry){
           if(entry == 'charbreak') {
               str += " ";
           } else if( entry == 'wordbreak') {
               str += ", ";
           } else {
               str += entry;
           }
        });
        return str;
    }

});
