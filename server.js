const handlebars = require('express-handlebars');
const express = require('express');
const config = require('config');
const path = require('path');
const cors = require('cors');
const app = express();

const { connectDb } = require('./services/db/db');
const { checkUser, checkPermission } = require('./middlewares/authMiddleware');
const { hbs_account, hbs_login } = require('./middlewares/handlebars');
const { prodMidleware } = require('./middlewares/prodMidleware');
const { general } = require('./routes/generalPageRouter');
const { supperAdmin } = require('./routes/supperAdmin');
const { newUserSave } = require('./routes/userRoutes');
const { category } = require('./routes/categoryBook');
const { favorite } = require('./routes/favorite');
const { login } = require('./routes/loginRoutes');
const { comment } = require('./routes/comment');
const { admin } = require('./routes/admin');
const { book } = require('./routes/book');




connectDb();
prodMidleware(app);


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.engine('.hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', '.hbs');

app.use('/index', express.static(path.resolve(__dirname, 'frontend')));
app.use('/login', express.static(path.resolve(__dirname, "public")));
app.use('/account', express.static(path.resolve(__dirname, "public")));

app.use('/api/category', checkUser, checkPermission(['supperAdmin', 'admin', 'user']), category);
app.use("/api/favorite", checkUser, checkPermission(['supperAdmin', 'admin', 'user']), favorite);
app.use('/api/comment', checkUser, checkPermission(['supperAdmin', 'admin', 'user']), comment);
app.use('/api/book', checkUser, checkPermission(['supperAdmin', 'admin', 'user']), book);
app.use('/api/admin', checkUser, checkPermission(['supperAdmin', 'admin']), admin);
app.use('/api/role', checkUser, checkPermission(['supperAdmin']), supperAdmin);
app.use('/api/newUser', newUserSave);
app.use('/api/general', general);
app.use('/account', hbs_account);
app.use('/api/login', login);
app.use('/login', hbs_login);



const port = config.get('PORT') || 3000;
app.listen(port, () => console.log('listening on port ' + port))