const express = require("express");
const Tasks = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

/**
 * *Tasks
 */

// post -> to create
router.post("/tasks", auth, async (req, res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// get (find({})) -> to read everything
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    // Mengambil nilai dari query string
    // Jika terdapat req.query.completed ("false" maupun "true") akan masuk pada pengondisian di bawah.
    if (req.query.completed) {
        // req.query.completed akan mengembalikan nilai string, sehingga harus dibandingkan dengan "true"
        // dengan begitu match.completed akan bernilai true ataupun false bergantung pada query stringnya.
        match.completed = req.query.completed === "true";
    }

    // Jika terdapat req.query.sortBy akan masuk pada pengondisian di bawah.
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        // const tasks = await Tasks.find({ owner: req.user._id });
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});

// get (findById) -> to read by its Id
router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

// patch (findByIdAndUpdate(id, whatYouWantToUpdate, Option)) -> update
router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedOperation = ["description", "completed"];
    const isValid = updates.every((update) =>
        allowedOperation.includes(update)
    );

    if (!isValid) {
        return res.status(400).send();
    }

    try {
        const task = await Tasks.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => (task[update] = req.body[update]));
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// delete (findByIdAndDelete(id)) -> delete
router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Tasks.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
