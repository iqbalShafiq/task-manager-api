const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./task");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Your email is invalid");
                }
            },
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error("Age must be positive!");
                }
            },
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: 7,
            validate(value) {
                if (value.toLowerCase().includes("password")) {
                    throw new Error("Password couldn't contains 'password'.");
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    {
        timestamps: true,
    }
);

// Membuat hubungan user dan tasks (virtual -> tidak masuk ke database user)
userSchema.virtual("tasks", {
    ref: "Tasks",
    localField: "_id",
    foreignField: "owner",
});

// Menyembunyikan hashed password dan tokens dari user
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

// Generate AuthToken setelah login
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    ); // generate token

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// Memvalidasi hashed password
userSchema.statics.findByCrudentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable to login.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login.");
    }

    return user;
};

// Hash the password that created or updated
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Remove all Tasks when deleting user
userSchema.pre("remove", async function (next) {
    const user = this;
    await Tasks.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
