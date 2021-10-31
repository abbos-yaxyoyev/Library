const { BooksModel } = require('../models/booksModels');
const { errorBookNotFound } = require('../utils/utils');


async function getAllBooks(req, res) {
    try {
        let { pageSize, currentPage } = req.params;
        pageSize = parseInt(pageSize);
        currentPage = parseInt(currentPage);
        const count = await BooksModel.count();
        const books = await BooksModel.find(
            {},
            { date: 0, __v: 0 }
        )
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        errorBookNotFound(res, books);
        res.status(201).send({ books, count, currentpage: currentPage });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllBooks
}