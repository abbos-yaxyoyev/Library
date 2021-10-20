const { Router } = require('express')
const router = Router()

const {
    pushFavorites,
    deletFavoriteBook,
    allFavoriteBook
} = require('../controllers/favoriteBook')


router.delete('/:id', deletFavoriteBook);
router.get('/', allFavoriteBook);
router.post('/', pushFavorites);

module.exports = {
    favorite: router
}