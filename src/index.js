const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const Tasks = require("./models/task");
const User = require("./models/user");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server is up on port " + port);
});

/**
 * *NPM Playground
 */

//* Files upload using multer
// const multer = require("multer");
// const upload = multer({
//     dest: "images",
//     limits: {
//         fileSize: 1000000,
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error("Please upload Word file"));
//         }

//         cb(undefined, true);
//     },
// });

// app.post("/upload", upload.single("upload"), (req, res) => {
//     res.send();
// });

//* relation between user and tasks
// const main = async () => {
//     //* task's owner:
//     // const task = await Tasks.findById("5ef774f8442fc9522cbc510f");
//     // await task.populate("owner").execPopulate();
//     // console.log(task);

//     //* owner's tasks:
//     const user = await User.findById("5ef7748d426917488ce68944");
//     await user.populate("tasks").execPopulate();
//     console.log(user.tasks);
// };
// main();

//* jsonwebtoken
/* const jwt = require("jsonwebtoken");
const jwtFunction = async () => {
    const token = jwt.sign({ _id: "asd123" }, "isrisrisr", {
        expiresIn: "7 days",
    });
    console.log(token);

    const data = jwt.verify(token, "isrisrisr");
    console.log(data);
};

jwtFunction(); */

//* bcrypt
/* const bcrypt = require("bcryptjs");
const passFunction = async () => {
    const password = "isrIsr";
    const hashedPassword = await bcrypt.hash(password, 8);

    const isMatch = await bcrypt.compare("isrisr", hashedPassword);
    console.log(isMatch);
};

passFunction(); */

//* Middleware
// app.use((req, res, next) => {
//     res.status(503).send("We are maintance!");
// });
