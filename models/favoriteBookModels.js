const mongoose = require('mongoose');
const config = require('config');

const favoriteBookSchema = new mongoose.Schema(
    {
        book_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }
);

const favoriteUserSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId
        },
        favoriteBooks: {
            type: [favoriteBookSchema],
            default: []
        }
    }
);

const FavoriteBookModel = mongoose.model("favoriteBooks", favoriteUserSchema);

module.exports = { FavoriteBookModel }
