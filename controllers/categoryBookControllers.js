const { validateBookCategory, errorBookNotFound } = require('../utils/utils');
const { CategoryBookModel } = require('../models/booksCategoryModels');

async function createCategory(req, res) {
    const { category } = req.body;
    try {
        const { error } = await validateBookCategory(req.body);
        if (error) {
            console.log(error);
            let errorMessage = error.details[0].message;
            return res.status(404).send(errorMessage)
        }

        const newContent = new CategoryBookModel({
            category
        });
        const categorySave = await newContent.save();
        res.status(200).send(categorySave);
    } catch (error) {
        console.log(error.message);
    }
}

async function getAllCategory(req, res) {
    let { pageSize, currentPage } = req.params;
    pageSize = parseInt(pageSize);
    currentPage = parseInt(currentPage);
    try {
        const count = await CategoryBookModel.count();
        const categories = await CategoryBookModel.find()
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        errorBookNotFound(res, categories);
        res.status(201).send({ categories, count, currentpage: currentPage, role: req.user.role });
    }
    catch (error) {
        console.log(error);
    }
}

async function editCategory(req, res) {
    const { id } = req.params;
    const { category } = req.body;
    try {
        const { error } = await validateBookCategory({ category });
        if (error) {
            let errorMessage = error.details[0].message;
            return res.status(404).send(errorMessage)
        }

        const categorySave = await CategoryBookModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    category: category
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(200).send(categorySave);
    } catch (error) {
        console.log(error);
    }
}

async function deleteOneCategory(req, res) {
    const { id } = req.params;
    try {
        const book = await CategoryBookModel.deleteOne({ _id: id });
        const count = await CategoryBookModel.count({_id});
        errorBookNotFound(res, book);
        res.status(201).send({book, count});
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    deleteOneCategory,
    getAllCategory,
    createCategory,
    editCategory
}