const { Router } = require('express')
const router = Router();

const {
    getAllCategory
} = require('../controllers/categoryBookControllers')


router.get('/:pageSize/:currentPage', getAllCategory);

module.exports = {
    category: router
}