const { Router } = require('express')
const router = Router();

const { getAllBooks } = require('../controllers/genaralPage')


router.get('/', getAllBooks)

module.exports = {
    general: router
}