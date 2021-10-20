const helmet = require('helmet');
const compression = require('compression');

function prodMidleware(app) {
    app.use(helmet());
    app.use(compression());
}

module.exports = {
    prodMidleware
}