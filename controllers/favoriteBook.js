const { FavoriteBookModel } = require('../models/favoriteBookModels');
const mongoose = require('mongoose');

async function createFavoriteBook(res, user_id) {
    try {
        const favoriteBook = new FavoriteBookModel({
            user_id,
        })

        await favoriteBook.save();
        // res.status(200).send({ message: 'succes' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message })
    }
}

async function pushFavorites(req, res) {
    const { user_id } = req.user;
    const { book_id } = req.body;

    let bookId = mongoose.Types.ObjectId(book_id);
    let userId = mongoose.Types.ObjectId(user_id);

    try {

        const favoritebook = await FavoriteBookModel.aggregate([
            { $match: { user_id: userId } },
            { $unwind: "$favoriteBooks" },
            { $match: { 'favoriteBooks.book_id': bookId } }
        ]);


        if (favoritebook[0]) {
            console.log('favoritebook :', favoritebook);
            return res.status(401).send({ message: 'already save favorite book id' });
        }

        await FavoriteBookModel.findOneAndUpdate(
            { user_id: userId },
            {
                $push: {
                    favoriteBooks: {
                        date: Date.now(),
                        book_id: bookId
                    }
                }
            }
        );

        return res.status(200).send({
            message: 'save favorite book id'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message })
    }

}

async function deletFavoriteBook(req, res) {
    const { user_id } = req.user;
    const { id } = req.params;

    let bookId = mongoose.Types.ObjectId(id);
    let userId = mongoose.Types.ObjectId(user_id);

    try {
        const favoritebook = await FavoriteBookModel.aggregate([
            { $match: { user_id: userId } },
            { $unwind: "$favoriteBooks" },
            { $match: { 'favoriteBooks.book_id': bookId } }
        ]);

        if (!favoritebook[0]) {
            return res.status(401).send({ message: 'Note Found favorite book id' });
        }

        const delteBook = await FavoriteBookModel.updateOne(
            { user_id: userId },
            {
                $pull: {
                    favoriteBooks: {
                        book_id: bookId
                    }
                }
            },
            { multi: true }
        );
        res.status(200).send({
            message: 'delete favorite book id',
            delteBook
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

async function allFavoriteBook(req, res) {
    const { user_id } = req.user;
    let userId = mongoose.Types.ObjectId(user_id);


    try {
        const allfavorite = await FavoriteBookModel.aggregate([
            {
                $match: { user_id: userId }
            },
            // { $unwind: "$favoriteBooks" },
            {
                $lookup:
                {
                    from: 'books',
                    localField: 'favoriteBooks.book_id',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            {
                $project: {
                    _id: 0,
                    favoriteBooks: 0,
                    __v: 0,
                    user_id: 0,
                    'book.createdAt': 0,
                    'book.__v': 0
                }
            }
        ]);

        res.status(200).send(allfavorite);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}


module.exports = {
    createFavoriteBook,
    deletFavoriteBook,
    allFavoriteBook,
    pushFavorites
}