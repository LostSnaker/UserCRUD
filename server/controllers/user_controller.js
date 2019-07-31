var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200'
});

function checkInput(input) {
    result = !(input.name) || !(input.surname) || !(input.birthdayDate) || !(input.phone)
        || !(input.email);
    return result;
}


function handleErrors(statusCode){
    var errorMessages = new Map([
        [400,"Error: Bad Request"],
        [404,"Error: Not Found"],
        [409,"Error: Conflict"],
        [500,"Internal Server Error"]]);
    return errorMessages.get(statusCode);
}

exports.userCreate = function (req, res) {

    let {name, surname, birthdayDate, phone, email, dateOfChange} = req.body;

    result = checkInput(req.body)

    client.search({
        index: 'test-users',
        body:{
            "query" : {
                "constant_score" : {
                    "filter" : {
                        "term" : {
                            phone
                        }
                    }
                }
            },  "size": 0
        }
    },function(error, resp, status) {

        if (resp.hits.total.value == 0) {

            client.search({
                index: 'test-users',
                body:{"query" : {
                        "constant_score" : {
                            "filter" : {
                                "match_phrase" : {
                                    email
                                }
                            }
                        }
                    },  "size": 0
                }
            },function(error, resp, status) {

                if (resp.hits.total.value == 0) {

                    client.index({
                        index: 'test-users',
                        type: 'user',
                        body: {
                            name,
                            surname,
                            birthdayDate,
                            phone,
                            email,
                            dateOfChange
                        }
                    },function (error, resp, status) {
                        if (error) {
                            res.send(handleErrors(status));
                        }
                        else {
                            res.send("User was successfully created!");
                        }

                    })
                }else{
                    res.status(409).send("This email is already in use!");
                }

            });
        } else {
            res.status(409).send("This phone number is already in use!");
        }
    });

};

exports.userRead = function (req, res) {

    let entityId = req.params.id;
    client.get({
        index: 'test-users',
        type: 'user',
        id: entityId
    },function(error, resp, status) {
        if(error) {
            res.send(handleErrors(status));
        }
        else {
            res.json(resp._source);
        }
    });
};

exports.userUpdate = function (req, res) {

    let entityId = req.params.id;
    let {name, surname, birthdayDate,phone,email,dateOfChange} = req.body;

    client.index({
        index: 'test-users',
        type: 'user',
        id: entityId,
        body: {
            name,
            surname,
            birthdayDate,
            phone,
            email,
            dateOfChange
        }
    },function(error, resp, status) {
        if(error) {
            res.send(handleErrors(status));
        }
        else {
            res.send("User data was successfully updated!");
        }
    });
};

exports.userDelete = function (req, res) {

    let id = req.params.id;
    client.delete({
        index: 'test-users',
        id,
        type: 'user'
    },function(error,resp,status) {
        if(error) {
            res.send(handleErrors(status));
        }
        else {
            res.send("User data was successfully deleted!");
        }
    });
};

exports.readAll = function (req, res) {

    client.search({
        index: 'test-users',
        body: {
            query: {
                "match_all": {}
            }
        }
    },function(error, resp, status) {
        if(error) {
            res.send(handleErrors(status));
        }
        else {
            res.status = 200;
            res.json(resp.hits.hits);
        }
    });
};
