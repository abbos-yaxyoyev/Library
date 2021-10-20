const mongoose = require('mongoose');
const config = require('config');

function connectDb() {
    console.log('db');
    mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("mongodbga ulanish muvaffaqiyatli amalga oshdi !!!");
        })
        .catch(err => {
            console.log(err.message);
            process.exit(1)
        });
}

module.exports = {
    connectDb
}