const multer = require('multer');
const path = require('path');

let imgStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './frontend/images')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.split('.')[0] + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({ storage: imgStorage });

module.exports = { upload };
