const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/userModels');
const { validateEmailPassword } = require('../utils/utils');

async function loginUser(req, res) {
    console.log('login: 1');
    const { email, password } = req.body
    const { error } = validateEmailPassword(req.body);
    console.log('login: 2');
    if (error) {
        console.log('login: 3');
        let errorMessage = error.details.map(x => x.message).join(', ');
        return res.status(404).send(errorMessage);
    }
    try {
        const user = await UserModel.findOne({ email: email });
        console.log('login: 4');
        if (!user) {
            console.log('login: 5');
            return res.status(400).send({ message: 'Login or Password is incorrect', data: req.body })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        console.log('login: 6');
        if (!isMatch) {
            console.log('login: 7');
            return res.status(400).send({ message: 'Login or Password is incorrect', data: req.body })
        }
        console.log('login: 8');
        const token = jwt.sign({ user_id: user._id, role: user.role }, config.get('SECRET_KEY'), { expiresIn: '12d' });
        return res.status(200).send(JSON.stringify(token));
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'server invalid', data: req.body })
    }
}

module.exports = {
    loginUser
}
