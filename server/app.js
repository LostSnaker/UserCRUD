var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var user = require('./routes/user_routes');

app.use('/users', user);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

