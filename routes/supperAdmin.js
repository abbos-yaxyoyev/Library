const { Router } = require('express')
const router = Router();

const { roleUser, roleAlluser } = require('../controllers/roleUser');


router.patch('/:id', roleUser);
router.patch('/', roleUser);

module.exports = {
    supperAdmin: router
}