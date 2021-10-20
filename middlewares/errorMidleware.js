// Require logger.js
const { logger } = require('../utils/logger');

function errorStatus500(err, req, res, next) {
    console.log('500');
    res.status(500).send('Could not perform the calculation!');
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
}

function errorStatus404(req, res, next) {
    console.log('404');
    res.status(404).send("PAGE NOT FOUND");
    logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
}

module.exports = {
    errorStatus500,
    errorStatus404
}