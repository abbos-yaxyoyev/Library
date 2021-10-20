const config = require('config');

function hbs_login(req, res) {
    res.render('login', {
        title: 'Login page',
        script: config.get('login'),
        css: config.get('css'),
        src: config.get('src')
    })
}

function hbs_account(req, res) {
    res.render('password', {
        title: 'Creat an account',
        script: config.get('account'),
        css: config.get('css'),
        src: config.get('src')
    })
}

module.exports = {
    hbs_login,
    hbs_account
}