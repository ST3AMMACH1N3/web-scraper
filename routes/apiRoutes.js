let db = require('../models');
let axios = require('axios');
let cheerio = require('cheerio');

module.exports = function(app) {
    app.get('/api/article', (req, res) => {
        db.Article.find({}).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    });

    app.get('/api/article/:id', (req, res) => {
        db.Article.findById(req.params.id).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    });

    app.get('/api/save/:id', (req, res) => {
        db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: true } }).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    });

    app.get('/api/unsave/:id', (req, res) => {
        db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: false } }).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    });

    app.get('/api/saved', (req, res) => {
        db.Article.find({ saved: true }).then(data => {
            res.json(data);
        }).catch(err => {
            console.log(err);
        })
    });

    app.get('/api/scrape', (req, res) => {
        axios.get('https://apnews.com/').then(response => {
            let $ = cheerio.load(response.data);

            $('div.FeedCard').each((i, element) => {
                let article = {
                    url: 'https://apnews.com/' + $(element).find('a.headline').attr('href'),
                    headline: $(element).find('a.headline').text(),
                    summary: $(element).find('div.content').find('p').text()
                }
                db.Article.create(article).then(dbArticle => {
                    console.log(dbArticle);
                }).catch(err => {
                    console.log(err);
                })
            });
            res.send('Scrape Complete');
        }).catch(err => {
            console.log(err);
        })
    });
}