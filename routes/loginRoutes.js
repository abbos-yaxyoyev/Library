const { Router } = require('express')
const router = Router();

const { loginUser } = require('../controllers/loginControllers')


router.post('/', loginUser)

module.exports = {
    login: router
}