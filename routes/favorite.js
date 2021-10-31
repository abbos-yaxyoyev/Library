const { Router } = require('express')
const router = Router()

const {
    pushFavorites,
    deleteFavoriteBook,
    allFavoriteBook
} = require('../controllers/favoriteBook')


router.delete('/:id', deleteFavoriteBook);
router.get('/:pageSize/:currentPage', allFavoriteBook);
router.post('/:id', pushFavorites);

module.exports = {
    favorite: router
}