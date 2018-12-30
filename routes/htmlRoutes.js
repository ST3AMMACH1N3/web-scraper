let db = require('../models');

module.exports = function(app) {
    app.get('/', (req, res) => {
        db.Article.find({ saved: false }).sort({dateCreated: -1}).populate('notes').then(data => {
            res.render('index', { article: data });
        }).catch(err => {
            res.render('index');
            console.log(err);
        })
    })  

    app.get('/saved', (req, res) => {
        db.Article.find({ saved: true }).sort({dateCreated: -1}).populate('notes').then(data => {
            console.log(data);
            console.log(data[0].notes);
            res.render('index', { article: data, page: 'saved' });
        }).catch(err => {
            res.render('index', { page: 'saved' });
            console.log(err);
        })
    })

    app.get('*', (req, res) => {
        res.render('404');
    })  
}