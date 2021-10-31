const { Router } = require('express')
const router = Router();

const { roleUser, roleAlluser } = require('../controllers/roleUser');


router.patch('/:id', roleUser);
router.get('/:pageSize/:currentPage', roleAlluser);

module.exports = {
    supperAdmin: router
}