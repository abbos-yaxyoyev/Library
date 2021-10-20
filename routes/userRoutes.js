const { Router } = require('express')
const router = Router();

const { createUser } = require('../controllers/newUserSave')


router.post('/', createUser)

module.exports = {
    newUserSave: router
}