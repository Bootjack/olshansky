define([
    'highland',
    'src/mapping',

    'src/input',
    'src/morse',
    'src/text'
], function (
    hl,
    mapping,

    Input,
    Morse,
    Text
) {
    console.log('highland loaded', hl);

    var bufferElement, combinedInput, keyInput, morseOutput, mouseInput, outputElement, textOutput, touchInput;

    outputElement = document.getElementById('olshky-output-content');
    bufferElement = document.getElementById('olshky-buffer-content');
    inputElement = document.getElementById('olshky-input-element');

    keyInput = new Input({
        element: document.body,
        startEventName: 'keydown',
        stopEventName: 'keyup'
    });

    mouseInput = new Input({
        element: document.body,
        startEventName: 'mousedown',
        stopEventName: 'mouseup'
    });

    touchInput = new Input({
        element: document.body,
        startEventName: 'touchstart',
        stopEventName: 'touchend'
    });

    /*
    var morseInterpreter = new interpreter();
    var arr2 = [".", "-", "charbreak", ".", "wordbreak", ".", ".", "charbreak"];
    morseInterpreter.translateDitsDashes(arr2);

    keyInput.stream.each(function (inp) {
        morseInterpreter.addDuration(inp.state, inp.duration);
    });
    */

    combinedInput = hl([keyInput.stream.fork(), touchInput.stream.fork()]).merge();

    combinedInput.fork().each(function (signal) {
        inputElement.className = (signal.state ? '' : 'active');
    });

    morseOutput = new Morse({
        input: combinedInput,
        cadence: 120
    });

    textOutput = new Text({
        input: morseOutput.stream
    });

    morseOutput.stream.fork().each(function (signal) {
        //console.log('morse', signal.value);
    });

    textOutput.stream.fork().each(function (val) {
        //console.log('text', val);
    });

    textOutput.text.fork().each(function (val) {
        if (val === mapping.signals.break.line) {
            outputElement.textContent += bufferElement.textContent + val;
            outputElement.parentElement.scrollTop = outputElement.offsetHeight - outputElement.parentElement.offsetHeight;
            bufferElement.textContent = '';
        } else {
            bufferElement.textContent += val;
        }
    });

    window.outputElement = outputElement;
});
