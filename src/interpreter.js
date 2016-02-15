
define([
    'highland'
], function (
    hl
) {

    interpreter = function() {
        this.codeMap = {
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
        
        this.buffer = [];
        this.durations = [];
    }
    
    interpreter.prototype.addDuration = function(state, duration) {

        this.buffer.push({state: state, duration: duration});
        if(this.durations.length != 0 || state != 0) {
            this.calcDurations(state, duration);
        }
        console.log(this.durations);
        this.interpret(this.durations);
    }
    
    interpreter.prototype.calcDurations = function(state, duration) {
        this.durations.push(duration);
    }

    // data is a list of integers where the first integer is the length of time on
    // and the next integer is the length of time off, and so on.
    interpreter.prototype.interpret = function(data) {
        var ons = data.filter(
            function(item, index){ 
                return (index % 2 == 0);
            });
        var offs = data.filter(
            function(item, index){ 
                return (index % 2 == 1);
            });

        console.log(ons);
        console.log(offs);

        this.findOnGroups(ons);
        var signals = [];
        for(var i = 0; i < data.length; ++i) {
            if(i % 2 == 0) {
                // interpreting sound
                if(data[i] > 120) {
                    signals.push("-");
                } else {
                    signals.push(".");
                }
            } else {
                if(data[i] > 400) {
                    signals.push("wordbreak");
                } else if(data[i] > 200){
                    signals.push("charbreak");
                } 
                // interpreting silence
            }
        }
        return this.translateDitsDashes(signals);
    }

    interpreter.prototype.findOnGroups = function(ons) {
        // possible that we only actually have one group of symbols (only dits or dashes)

        // find distance from one point to other points
        // put the distances into bins
        // find maximal groupings that minimize distance of like points

        var sortedOns = ons.sort(
            function comp(a, b){
                return a - b;
            }); // ascending

        if(sortedOns[sortedOns.length - 1] - sortedOns[0] < 2 * sortedOns[0]) {
            // probably only one group according to our rough heuristic
        }
        var deltas = [];
        for(var i = 1; i < sortedOns.length; ++i) {
            deltas.push(sortedOns[i] - sortedOns[i - 1]);
        }
        //console.log(sortedOns);
        //console.log(deltas);

    }

    interpreter.prototype.findOffGroups = function(offs) {
        var sortedOffs = offs.sort(
            function comp(a, b){
                return a - b;
            }); // ascending

        if(sortedOffs[sortedOffs.length - 1] - sortedOffs[0] < 2 * sortedOffs[0]) {
            // probably only one group according to our rough heuristic
        }
        var deltas = [];
        for(var i = 1; i < sortedOffs.length; ++i) {
            deltas.push(sortedOffs[i] - sortedOffs[i - 1]);
        }
        console.log(sortedOffs);
        console.log(deltas);
    }

    // signals is a list that can only contain certain values: ".", "-", "charbreak", "wordbreak"
    interpreter.prototype.translateDitsDashes = function(signals) {
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
    interpreter.prototype.extractCharacter = function(signals) {
        if(signals[0] =='wordbreak') {
            signals.splice(0, 1);
            return ' ';
        }
        while(signals[0] == 'charbreak' || signals[0] == 'wordbreak'){
            signals.splice(0, 1);
        }
        var cbIndex = signals.indexOf("charbreak");
        var wbIndex = signals.indexOf("wordbreak");
        // the absence of character breaks and/or word breaks could be thre result of
        // misinterpreting a beep or a silence, but for now we will ignore this
        if(cbIndex == -1 && wbIndex == -1 ) {
            return null;
        }
        var charEnd = 0;
        if(cbIndex == -1) {
            charEnd = wbIndex;
        } else if(wbIndex == -1) {
            charEnd = cbIndex;
        } else {
            charEnd = Math.min(wbIndex, cbIndex);
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
});