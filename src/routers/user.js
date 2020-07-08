const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendGoodByeEmail } = require("../emails/account");

/**
 * *Users
 */

// post -> to create
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }

    /* user.save()
        .then(() => {
            res.status(201).send(user);
        })
        .catch((error) => {
            res.status(400).send(error);
        }); */
});

// post -> to login
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCrudentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

// post -> to logout
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// post -> to logout
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// get (find({})) -> to read everything
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

// patch (findByIdAndUpdate(id, whatYouWantToUpdate, Option)) -> update
router.patch("/users/me", auth, async (req, res) => {
    // Untuk setting property mana saja yang boleh diupdate
    const updates = Object.keys(req.body);
    const allowedOperation = ["name", "age", "email", "password"];
    const isValid = updates.every((update) =>
        allowedOperation.includes(update)
    );

    if (!isValid) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }

    // using findByIdAndUpdate
    // using findById -> refactor agar middleware dapat beraksi
    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        /*  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }); */

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// delete (findByIdAndDelete(id)) -> delete
router.delete("/users/me", auth, async (req, res) => {
    try {
        // refactor
        await req.user.remove();
        sendGoodByeEmail(req.user.email, req.user.name);
        res.send(req.user);

        /* const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user); */
    } catch (e) {
        res.status(500).send();
    }
});

// UIploading files
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("You have to upload images file"));
        }

        cb(undefined, true);
    },
});

// post -> to upload file
router.post(
    "/users/me/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

// get -> get user's avatar
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            return new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

// delete -> delete avatar (uploaded file)
router.delete(
    "/users/me/avatar",
    auth,
    async (req, res) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

module.exports = router;
