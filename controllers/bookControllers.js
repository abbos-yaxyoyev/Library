const { validateBook, errorBookNotFound } = require('../utils/utils');
const { BooksModel } = require('../models/booksModels');

async function createBook(req, res) {

    console.log(req.files);
    let str = req.files[0].path.split('\\');
    let url = str[1] + "\\" + str[2];

    const obj = {
        user_id: req.user.user_id,
        category_id: req.body.category_id,
        author: req.body.author,
        describtion: req.body.describtion,
        ISBN: req.body.ISBN,
        status: req.body.status,
        quantity: req.body.quantity,
        bookname: req.body.bookname,
        urlImg: url
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
    let { pageSize, currentPage } = req.params;
    try {
        pageSize = parseInt(pageSize);
        currentPage = parseInt(currentPage);
        const count = await BooksModel.count({ user_id });

        const books = await BooksModel
            .find(
                { user_id },
                { date: 0, user_id: 0, __v: 0 }
            )
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
        errorBookNotFound(res, books);
        res.status(201).send({ books, count, currentpage: currentPage });
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

async function findSearchBook(req, res) {
    let { name } = req.params;
    console.log(name);
    // const { user_id } = req.user;
    try {
        const book = await BooksModel.find({ category_id: new RegExp('.*' + name + '.*', "i") });
        errorBookNotFound(res, book);
        console.log(book);
        res.status(201).send(book);
    }
    catch (error) {
        console.log(error);
    }
}

async function searchNameBook(req, res) {
    let { name } = req.params;
    try {
        const book = await BooksModel.find({ bookname: new RegExp('.*' + name + '.*', "i") });
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
    const { category_id, author, describtion, ISBN, status, quantity, bookname } = req.body;
    console.log(req.files);
    let str = req.files[0].path.split('\\');
    let url = str[1] + "\\" + str[2];
    console.log(id);
    const obj = {
        user_id,
        category_id,
        author,
        describtion,
        ISBN,
        status,
        quantity,
        bookname,
        urlImg: url
    }
    try {
        const { error } = await validateBook(obj);
        if (error) {
            let errorMessage = error.details[0].message;
            return res.status(404).send(errorMessage)
        }
        const book = await BooksModel.findOneAndUpdate(
            { user_id: user_id, _id: id },
            {
                $set: {
                    category_id: category_id,
                    user_id: user_id,
                    author: author,
                    describtion: describtion,
                    bookname: bookname,
                    urlImg: url,
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
        res.status(200).send(book);
    }
    catch (error) {
        console.log(error);
    }
}



module.exports = {
    findSearchBook,
    searchNameBook,
    createBook,
    userAllBooks,
    deleteOneBook,
    findOneBook,
    editBook
}