const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true },
    (error, client) => {
        if (error) {
            console.log("Unable to connect to database!");
        }

        const db = client.db(databaseName);

        /**
         * *Delete
         */
        //!! deleteMany
        /* db.collection("users")
            .deleteMany({
                age: 20,
            })
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            }); */

        //!! deleteOne
        db.collection("tasks")
            .deleteOne({
                _id: new ObjectID("5ee0937445def03b70131109"),
            })
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            });

        /**
         * *Update
         */
        //!! updateOne
        /* db.collection("users")
            .updateOne(
                {
                    _id: new ObjectID("5ee092849b89cd199ce177ab"),
                },
                {
                    $set: {
                        name: "Hangi",
                    },
                    $inc: {
                        age: 1,
                    },
                }
            )
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            }); */

        //!! updateMany
        /* db.collection("tasks")
            .updateMany(
                {
                    completed: true,
                },
                {
                    $set: {
                        completed: false,
                    },
                }
            )
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(errror);
            }); */

        /**
         * *Read
         */
        //!! findOne
        /* db.collection("users").findOne(
            { _id: new ObjectID("5ee38e05355f192908efa2c7") },
            (error, result) => {
                if (error) {
                    return console.log("Unable to fetch!");
                }

                console.log(result);
            }
        ); */

        //!! find
        /* db.collection("tasks")
            .find({ completed: true })
            .toArray((error, results) => {
                if (error) {
                    console.log("Unable to fetch");
                }

                console.log(results);
            }); */

        /**
         * *Create
         */
        //!! insertOne
        /* db.collection("users").insertOne(
            {
                name: "Reza",
                age: 20,
            },
            (error, result) => {
                if (error) {
                    return console.log("Unable to insert database!");
                }

                console.log(result.ops);
            }
        ); */

        //!! insertMany
        /* db.collection("tasks").insertMany(
            [
                {
                    description: "English 2",
                    completed: true,
                },
                {
                    description: "Calculus",
                    completed: false,
                },
                {
                    description: "Pemaba",
                    completed: true,
                },
            ],
            (error, result) => {
                if (error) {
                    return console.log("Unable to insert database!");
                }

                console.log(result.ops);
            }
        ); */
    }
);
