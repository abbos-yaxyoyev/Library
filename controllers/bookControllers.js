const { validateBook, errorBookNotFound } = require('../utils/utils');
const { BooksModel } = require('../models/booksModels');

async function createBook(req, res) {

    console.log(req.files);
    console.log(req.body.bookname);
    console.log(typeof req.body.bookname);
    console.log(typeof req.body.category_id);
    console.log(typeof req.body.author);
    console.log(typeof req.body.quantity);

    const obj = {
        user_id: req.user.user_id,
        category_id: req.body.category_id,
        author: req.body.author,
        describtion: req.body.describtion,
        ISBN: req.body.ISBN,
        status: req.body.status,
        quantity: req.body.quantity,
        bookname: req.body.bookname,
        urlImg: req.files[0].path
    }
    try {
        const { error } = await validateBook(obj);
        if (error) {
            console.log(error);
            let errorMessage = error.details[0].message;
            return res.status(404).send(errorMessage)
        }

        const newBook = new BooksModel({
            ...obj
        });
        const bookSave = await newBook.save();
        console.log(bookSave);
        res.status(200).send(bookSave);
    } catch (error) {
        console.log(error);
    }
}

async function userAllBooks(req, res) {
    const { user_id } = req.user;
    try {
        const books = await BooksModel.find({ user_id });
        errorBookNotFound(res, books);
        res.status(201).send(books);
    }
    catch (error) {
        console.log(error);
    }
}

async function deleteOneBook(req, res) {
    const { user_id } = req.user;
    const { id } = req.params;
    try {
        const book = await BooksModel.deleteOne({ user_id: user_id, _id: id });
        errorBookNotFound(res, book);
        console.log(book);
        res.status(201).send(book);
    }
    catch (error) {
        console.log(error);
    }
}

async function findOneBook(req, res) {
    const { user_id } = req.user;
    const { id } = req.params;
    try {
        const book = await BooksModel.findOne({ user_id: user_id, _id: id });
        errorBookNotFound(res, book);
        res.status(201).send(book);
    }
    catch (error) {
        console.log(error);
    }
}

async function editBook(req, res) {
    const { user_id } = req.user;
    const { id } = req.params;
    const { category_id, author, describtion, ISBN, status, quantity } = req.body;
    try {
        const { error } = await validateBook(req.body);
        if (error) {
            let errorMessage = error.details[0].message;
            return res.status(404).send(errorMessage)
        }
        const book = await BooksModel.findOneAndUpdate(
            { user_id: user_id, _id: id },
            {
                $set: {
                    category_id: category_id,
                    author: author,
                    describtion: describtion,
                    ISBN: ISBN,
                    status: status,
                    quantity: quantity
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        errorBookNotFound(res, book);
        res.status(201).send(book);
    }
    catch (error) {
        console.log(error);
    }
}



module.exports = {
    createBook,
    userAllBooks,
    deleteOneBook,
    findOneBook,
    editBook
}