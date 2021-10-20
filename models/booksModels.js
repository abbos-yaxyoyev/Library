const mongoose = require('mongoose');

const book = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        category_id: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 40,
            trim: true
        },
        bookname: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 70,
            trim: true
        },
        author: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 30,
            trim: true
        },
        describtion: {
            require: true,
            type: String,
            trim: true
        },
        ISBN: {
            required: true,
            type: String,
            minlength: 13,
            maxlength: 13,
            trim: true
        },
        status: {
            required: true,
            type: String,
        },
        quantity: {
            required: true,
            type: Number,
            default: 1
        },
        urlImg: {
            type: String,
            required: true,
            minlength: 6
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    { timestamps: true }
);

const BooksModel = mongoose.model("book", book);

module.exports = { BooksModel }
