const mongoose = require('mongoose');
const config = require('config');

const Camments = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        book_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        content: {
            type: String,
            maxlength: 100,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }
);



const CommentsBookModel = mongoose.model("CommentBooks", Camments);

module.exports = { CommentsBookModel }


