const { Router } = require('express')
const router = Router();

const {
    getAllCategory
} = require('../controllers/categoryBookControllers')


router.get('/', getAllCategory);

module.exports = {
    category: router
}