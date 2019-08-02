var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const user_controller = require('./controllers/user_controller');

app.use(bodyParser.json());

var user = require('./routes/user_routes');

app.use('/users', user);

var port = process.env.PORT || 3000;
var host = process.env.HOST || "localhost";
var elasticPort = 9200;

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
    user_controller.setElasticClient(host, elasticPort);
    user_controller.checkIndex("newindex");
});

