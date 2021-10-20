const { CommentsBookModel } = require('../models/bookCommentsModels')
const { validateComments, errorBookNotFound } = require('../utils/utils')

async function commentsBook(req, res) {
    const { user_id } = req.user;
    const { book_id, content } = req.body;
    let comment = { user_id, book_id, content };

    try {
        const { error } = await validateComments(comment);
        if (error) {
            console.log(error);
            let errorMessage = error.details[0].message;
            return res.status(404).send(errorMessage)
        }

        const newCommentsBook = new CommentsBookModel({
            user_id,
            book_id,
            content
        });
        const newComment = await newCommentsBook.save();
        res.status(201).send(newComment);
    } catch (error) {
        console.log(error);
    }
}

async function deleteComment(req, res) {
    const { id } = req.params;
    try {
        const comment = await CommentsBookModel.deleteOne({ _id: id });
        errorBookNotFound(res, comment);
        res.status(201).send(comment);
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = { commentsBook, deleteComment }