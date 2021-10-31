const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { UserModel } = require('../models/userModels');
const { validateUcer } = require('../utils/utils');
const { createFavoriteBook } = require('./favoriteBook')


async function createUser(req, res) {

    const { error } = await validateUcer(req.body);
    if (error) {
        let errorMessage = error.details[0].message;
        return res.status(404).send(errorMessage)
    }
    const { name, lastName, email, password } = req.body
    try {
        const checkUser = await UserModel.findOne({ email: email });
        if (checkUser) {
            res.status(400).send({
                message: `email or password already exists`,
                data: req.body
            })
        } else {
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new UserModel({
                name,
                lastName,
                email,
                password: hashedPassword,
            });
            await newUser.save();
            const token = jwt.sign({ user_id: newUser._id, role: newUser.role }, config.get('SECRET_KEY'), { expiresIn: '12d' });
            createFavoriteBook(res, newUser._id)
            res.status(200).send(JSON.stringify(token));
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'server error',
            data: req.body
        });
    }
}

async function findOneUser(req, res) {
    const { id } = req.params;
    try {
        const user = await UserModel.findOne({ _id: id });
        res.status(201).send(user);
    }
    catch (error) {
        console.log(error);
    }
}

async function deleteOneUser(req, res) {
    const { id } = req.params;
    try {
        const user = await UserModel.deleteOne({ _id: id });
        res.status(201).send(user);
    }
    catch (error) {
        console.log(error);
    }
}

async function allUser(req, res) {
    const { role } = req.user;
    let { pageSize, currentPage } = req.params;
    pageSize = parseInt(pageSize);
    currentPage = parseInt(currentPage);
    try {
        const count = await UserModel.count({});
        const allUser = await UserModel.aggregate([
            // {
            //     $lookup:
            //     {
            //         from: 'favoritebooks',
            //         localField: '_id',
            //         foreignField: 'user_id',
            //         as: 'favorite'
            //     }
            // },
            // {
            //     $unwind: "$favorite"
            // },
            {
                $lookup:
                {
                    from: 'books',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'book'
                }
            },
            {
                $project: {
                    name: 1,
                    lastName: 1,
                    email: 1,
                    role: 1,
                    date: 1,
                    bookNumber: {
                        $size: '$book'
                    },
                    // favoriteBookNumber: {
                    //     $size: "$favorite.favoriteBooks"
                    // }
                }
            },
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize }
        ]);

        res.status(201).send({ allUser, count, currentpage: currentPage, role });
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    allUser,
    createUser,
    findOneUser,
    deleteOneUser
}