const { Router } = require('express')
const router = Router();

const { deleteComment } = require('../controllers/commentsOfBook');
const { findOneUser, deleteOneUser, allUser } = require('../controllers/newUserSave');
const {
    deleteOneCategory,
    createCategory,
    editCategory
} = require('../controllers/categoryBookControllers');


router.get('/user/:pageSize/:currentPage', allUser);
router.delete('/category/:id', deleteOneCategory)
router.delete('/comment/:id', deleteComment)
router.put('/category/:id', editCategory);
router.delete('/user/:id', deleteOneUser);
router.post('/category', createCategory);
router.get('/user/:id', findOneUser);

module.exports = {
    admin: router
}