const { BooksModel } = require('../models/booksModels');


async function getAllBooks(req, res) {
    try {
        const books = await BooksModel.find();
        errorBookNotFound(res, books);
        res.status(201).send(books);
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = {
    getAllBooks
}