define([
    'highland',
    'src/mapping'
], function (
    hl,
    mapping
) {

    var SIG, CHAR;

    SIG = mapping.signals;
    CHAR = mapping.morseToChar;

    function Text(config) {
        config = config || {};
        this.character = '';
        this.input = config.input.fork();
        this.stream = this.input.fork().reduce('', reduceToText.bind(this));
        this.text = hl();
    }

    function mapToValue(signal) {
        return signal.value;
    }

    function reduceToText(prev, signal) {
        var character, confidence;
        if (signal.value === SIG.dit.mark || signal.value === SIG.dah.mark) {
            this.character += signal.value;
            this.confidence += signal.confidence;
            if (!CHAR[this.character]) {
                character = '?';
                confidence = 0.5;
                this.character = '';
                this.confidence = 0;
            }
        } else if (signal.value !== SIG.dit.rest) {
            if (CHAR[this.character]) {
                prev += CHAR[this.character];
                character = CHAR[this.character];
                confidence = this.confidence / this.character.length;
            } else {
                prev += signal.value;
                character = signal.value;
                confidence = 1;
            }
            this.character = '';
            this.confidence = 0;
        }
        if (character) {
            this.text.write({
                character: character,
                confidence: confidence
            });
        }
        return prev;
    }

    return Text;
});
