define([
    'highland',
    'src/input',
    'src/interpreter'
], function (
    hl,
    Input
) {
    console.log('highland loaded', hl);

    var mouseInput;

    mouseInput = new Input({
        element: document,
        startEventName: 'mousedown',
        stopEventName: 'mouseup'
    });
    
    
    var morseInterpreter = new interpreter();
    var arr2 = [".", "-", "charbreak", ".", "wordbreak", ".", ".", "charbreak"];
    morseInterpreter.translateDitsDashes(arr2);

    mouseInput.stream.each(function (inp) {
        morseInterpreter.addDuration(inp.state, inp.duration);
        console.log(inp.state, inp.duration);
    });
});
