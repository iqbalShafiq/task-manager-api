require("../src/db/mongoose");
const Task = require("../src/models/task");

/* Task.findByIdAndDelete("5ee495b4644b961f1c2238d7")
    .then((task) => {
        console.log(task);
        return Task.countDocuments({ completed: false });
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    }); */

const deleteStatusAndCount = async (id, completed) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed });
    return count;
};

deleteStatusAndCount("5ee48a599390fe450061833e", false)
    .then((count) => {
        console.log(count);
    })
    .catch((error) => {
        console.log(error);
    });
