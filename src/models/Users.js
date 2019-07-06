const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 10,
        validate(value) {
            if (validator.isNumeric(value)) {
                throw new Error(`Name can't be only numbers`);
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        validate(value) {
            if (validator.isNumeric(value)) {
                throw new Error(`Password can't be only numbers`);
            }
        }
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`Email format error`);
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: new Date().toLocaleString()
    },
    updatedAt: {
        type: String,
        default: new Date().toLocaleString()
    },
    lastLogin: {
        type: String,
        default: new Date().toLocaleString()
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    const now = new Date().toLocaleString();
    if (user.updatedAt !== now) {
        user.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
