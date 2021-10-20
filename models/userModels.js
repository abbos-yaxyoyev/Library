const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 30,
            trim: true
        },
        lastName: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 30,
            trim: true
        },
        email: {
            required: true,
            type: String,
            trim: true,
            minlength: 7,
            maxlength: 50,
            unique: true
        },
        password: {
            required: true,
            type: String,
            minlength: 6,
            maxlength: 100,
        },
        date: {
            type: Date,
            default: new Date()
        },
        role: {
            type: String,
            default: 'user'
        }
    },
    { timestamps: false }
);
//! Custom validation for email
usersSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

const UserModel = mongoose.model("user", usersSchema);

module.exports = { UserModel }
