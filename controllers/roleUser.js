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

        const roleUpdate = await UserModel.findOneAndUpdate(
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

        res.status(201).send(roleUpdate);

    } catch (error) {
        console.log(error);
    }
}

async function roleAlluser(req, res) {
    try {
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
            }
        ]);

        res.status(201).send(allUser);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    roleUser,
    roleAlluser
}