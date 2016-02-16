define([
    'highland',
    'src/input',
    'src/morse',
    'src/text'
], function (
    hl,
    Input,
    Morse,
    Text
) {
    console.log('highland loaded', hl);

    var keyInput, morseOutput, mouseInput, outputElement, textOutput;

    outputElement = document.getElementById('olshky-output-element');

    keyInput = new Input({
        element: document,
        startEventName: 'keydown',
        stopEventName: 'keyup'
    });

    mouseInput = new Input({
        element: document,
        startEventName: 'mousedown',
        stopEventName: 'mouseup'
    });

    morseOutput = new Morse({
        input: mouseInput.stream
    });

    textOutput = new Text({
        input: morseOutput.stream
    });

    morseOutput.stream.fork().each(function (signal) {
        //console.log(signal.value);
    });

    textOutput.stream.fork().each(function (val) {
        console.log(val);
    });

    textOutput.text.fork().each(function (val) {
        outputElement.textContent += val;
    });

    window.textOutput = textOutput;
});
