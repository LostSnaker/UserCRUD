var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'localhost:9200'
});


function validateUser(user, phone, email){
    if (user.phone === phone) {
        return "This phone is already in use!";
    } else if (user.email === email) {
        return "This email is already in use!";
    }
}

exports.userCreate = function (req, res) {

    let {name, surname, birthdayDate, phone, email, dateOfChange} = req.body;

    client.search({
        index: 'test-users',
        body:{
            "query" : {
                "bool" : {
                    "should" : [
                        {"match_phrase" : {
                                email
                            }},
                        {"term" : {
                                phone
                            }}
                    ]
                }
            },  "size": 1
        }
    }, function (error, resp, status) {
        if (resp.hits.hits[0] !== undefined) {
            res.status(409).send(validateUser(resp.hits.hits[0]._source, phone, email));
        } else {
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
            }, (error, resp, status) => {
                res.send((error ? status + ": " + error.message : "User data was successfully added!"));
            });
        }
    });
};

exports.userRead = function (req, res) {

    let entityId = req.params.id;
    client.get({
        index: 'test-users',
        type: 'user',
        id: entityId
    }, (error, resp, status) => {
        if(error) {
            res.send(status + ": " + error.message);
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
    }, (error, resp, status) => {
        if(error) {
            res.send(status + ": " + error.message);
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
    }, (error, resp, status) => {
        if(error) {
            res.send(status + ": " + error.message);
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
            }, "size" : 100
        }
    }, (error, resp, status) => {
        if(error) {
            res.send(status + ": " + error.message);
        }
        else {
            res.status = 200;
            res.json(resp.hits.hits);
        }
    });
};

exports.checkIndex = function (req, res) {

    client.indices.exists({
            index: "test-users"
        }, (error, resp, status) => {
            if (status == 404) {
                client.indices.create({
                    index: "test-users"
                }, (error, resp, status) => {
                    // if (error) {
                    //     res.send("Error: " + error.message);
                    // }
                    // else {
                    //     res.send("We have created new index!")
                    // }

                })
            }
            else {
                // res.send("It already exists!")
            }

        }
    )
};

