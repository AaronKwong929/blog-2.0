const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        minlength: 5,
        maxlength: 15,
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
    createdAt: {
        type: String,
        default: new Date().getTime(),
    },
    updatedAt: {
        type: String,
        default: new Date().getTime(),
    }
});

// userSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({email});
//     if (!user) {
//         throw new Error('User not existed');
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         throw new Error('Email or password incorrect');
//     }
//     return user;
// };

// userSchema.methods.generateAuthToken = async function () {
//     const user = this;
//     const token = jwt.sign({ _id: user.id.toString() }, 'aaron');
//     user.tokens = user.tokens.concat({ token });
//     await user.save();
//     return token;
// };

// userSchema.methods.toJSON = function () {
//     const user = this;
//     const userObject = user.toObject();
//     delete userObject.password;
//     delete userObject.tokens
//     return userObject;
// };

// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

module.exports  = mongoose.model('User', userSchema);
