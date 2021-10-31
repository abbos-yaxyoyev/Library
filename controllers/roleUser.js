const { UserModel } = require('../models/userModels');

async function roleUser(req, res) {
    const { role } = req.body;
    const { id } = req.params;

    try {
        const checkUser = await UserModel.findOne({ _id: id });
        if (!checkUser) {
            res.status(401).send({
                message: `user not found`
            })
        }
        console.log('role : ' + role);

        let roleChange = await UserModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    role: role
                }
            },
            {
                new: true,
                upsert: true
            }
        );
        console.log('roleChange : ', roleChange);

        res.status(201).send({ message: 'success update user role', roleChange });

    } catch (error) {
        console.log(error);
    }
}

async function roleAlluser(req, res) {
    let { pageSize, currentPage } = req.params;
    pageSize = parseInt(pageSize);
    currentPage = parseInt(currentPage);
    try {
        count = await UserModel.count({});
        const allUser = await UserModel.aggregate([
            {
                $project: {
                    name: 1,
                    lastName: 1,
                    email: 1,
                    role: 1,
                    _id: 1
                }
            },
            {
                $sort: {
                    role: 1
                }
            },
            { $skip: (currentPage - 1) * pageSize },
            { $limit: pageSize }
        ]);

        // console.log('count: ', count);
        // console.log('currentPage: ', currentPage);
        // console.log('allUser: ', allUser);
        res.status(201).send({ allUser, count, currentpage: currentPage });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    roleUser,
    roleAlluser
}