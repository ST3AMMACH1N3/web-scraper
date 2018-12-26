let db = require('../models');

module.exports = function(app) {
    app.get('/saved', (req, res) => {
        db.Article.find({ saved: true }).sort({dateCreated: -1}).then(data => {
            res.render('saved', { article: data });
        }).catch(err => {
            res.render('saved')
            console.log(err);
        })
    })

    app.get('*', (req, res) => {
        db.Article.find({ saved: false }).sort({dateCreated: -1}).then(data => {
            res.render('index', { article: data });
        }).catch(err => {
            res.render('index')
            console.log(err);
        })
    })  
}