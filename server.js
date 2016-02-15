var app, connect, port, stat;

port = 8080;

connect = require('connect');
stat = require('serve-static');
app = connect();

app.use(stat("./"));
app.listen(port, function () {
    console.log('Serving Olshansky on localhost:' + port);
});
