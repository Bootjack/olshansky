define([
    'highland',
    'src/input'
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

    mouseInput.stream.each(function (inp) {
        console.log(inp.state, inp.duration);
    });
});
