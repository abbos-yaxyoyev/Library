const mongoose = require('mongoose');

const categoryBooks = new mongoose.Schema(
    {
        category: {
            required: true,
            type: String,
            minlength: 3,
            maxlength: 36,
            trim: true
        }
    },
    { timestamps: true }
);

const CategoryBookModel = mongoose.model("category", categoryBooks);

module.exports = { CategoryBookModel }