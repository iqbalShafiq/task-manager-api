const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

/* 
const me = new User({
    name: "Shafiq",
    email: "shafiq@gmail.com",
    age: 19,
    password: "shafiqmeong",
});

me.save()
    .then(() => {
        console.log(me);
    })
    .catch((error) => {
        console.log(error);
    });
 */

/*
const myTask = new Tasks({
    description: "            Study Calculus            ",
    completed: false,
});
 
myTask
    .save()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
 */
