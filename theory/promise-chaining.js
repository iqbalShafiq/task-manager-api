require("../src/db/mongoose");
const User = require("../src/models/user");

/* User.findByIdAndUpdate("5ee4908f47dfda3cf056a696", { age: 19 })
    .then((user) => {
        console.log(user);
        return User.countDocuments({ age: 19 });
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    }); */

// Using Async Await
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
};

updateAgeAndCount("5ee4908f47dfda3cf056a696", 20)
    .then((count) => {
        console.log(count);
    })
    .catch((error) => {
        console.log(error);
    });
