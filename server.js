let express = require('express');
let exphbs = require('express-handlebars');
let mongoose = require('mongoose');
let axios = require('axios');
let cheerio = require('cheerio');

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

let db = require('./models');

const PORT = 3000;

let app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(MONGODB_URI);

app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main',
        partialsDir: __dirname + '/views/partials'
    })
);

app.set('view engine', 'handlebars');

require('./controllers/routes/apiRoutes')(app)
require('./controllers/routes/htmlRoutes')(app)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});