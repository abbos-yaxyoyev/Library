const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

async function validateBook(book) {
    const bookValidated = Joi.object({
        user_id: Joi.objectId(),
        bookname: Joi.string().required().min(3).max(70).trim(),
        category_id: Joi.string().required().min(3).max(40).trim(),
        author: Joi.string().required().min(3).max(60).trim(),
        describtion: Joi.string().required().trim().max(300),
        ISBN: Joi.string().required().trim().min(13).max(13),
        status: Joi.string().required().trim().min(3).max(20),
        urlImg: Joi.string().required().min(3).max(120).trim(),
        quantity: Joi.number().integer().required()
    })
    return await bookValidated.validate(book);
}

async function validateComments(book) {
    const commentValidated = Joi.object({
        user_id: Joi.objectId(),
        book_id: Joi.objectId(),
        content: Joi.string().trim().max(300)
    })
    return await commentValidated.validate(book);
}

async function validateBookCategory(category) {
    const contentValidates = Joi.object({
        category: Joi.string().max(100),
    })
    return await contentValidates.validate(category);
}

async function validateUcer(user) {
    const userValidated = Joi.object({
        name: Joi.string().required().min(3).max(30),
        lastName: Joi.string().required().min(3).max(30),
        email: Joi.string().required().min(7).max(100).email(),
        password: Joi.string().required().min(6).max(100),
    })
    return await userValidated.validate(user);
}

async function validateEmailPassword(req) {
    const validatedAuth = Joi.object({
        email: Joi.string().required().min(7).max(100).email(),
        password: Joi.string().required().min(6).max(100),
    })
    return await validatedAuth.validate(req);
}

function errorBookNotFound(res, book) {
    if (!book) {
        res.status(404).send({ message: "Not found" })
    }
}


module.exports = {
    validateBook,
    validateBookCategory,
    validateComments,
    validateUcer,
    validateEmailPassword,
    errorBookNotFound
}