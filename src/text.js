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
        var character;
        if (signal.value === SIG.dit.mark || signal.value === SIG.dah.mark) {
            this.character += signal.value;
            if (!CHAR[this.character]) {
                character = '?';
                this.character = '';
            }
        } else if (signal.value !== SIG.dit.rest) {
            if (CHAR[this.character]) {
                prev += CHAR[this.character];
                character = CHAR[this.character];
            } else {
                prev += signal.value;
                character = signal.value;
            }
            this.character = '';
        }
        if (character) {
            this.text.write(character);
        }
        return prev;
    }

    return Text;
});
