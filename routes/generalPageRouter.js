const { Router } = require('express')
const router = Router();

const { getAllBooks } = require('../controllers/genaralPage')


router.get('/:pageSize/:currentPage', getAllBooks)

module.exports = {
    general: router
}