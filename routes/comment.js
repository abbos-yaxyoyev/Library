const { Router } = require('express')
const router = Router();

const { commentsBook } = require('../controllers/commentsOfBook')


router.post('/', commentsBook);

module.exports = {
    comment: router
}