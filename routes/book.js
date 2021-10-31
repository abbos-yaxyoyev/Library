const { Router } = require('express')
const router = Router()
const { upload } = require('../middlewares/multer')

const {
    createBook,
    userAllBooks,
    deleteOneBook,
    findOneBook,
    editBook
} = require('../controllers/bookControllers')


router.post('/', upload.any(), createBook);
router.get('/userBooks/:pageSize/:currentPage', userAllBooks)
router.delete('/:id', deleteOneBook)
router.get('/:id', findOneBook)
router.put('/:id', upload.any(), editBook)

module.exports = {
    book: router
}