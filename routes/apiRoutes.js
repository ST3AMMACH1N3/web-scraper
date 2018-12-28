let db = require('../models');
let axios = require('axios');
let cheerio = require('cheerio');
let canScrapeAgain = true

module.exports = function(app) {
    app.get('/api/article', (req, res) => {
        db.Article.find({}).sort({dateCreated: -1}).then(data => {
            res.json(data);
        }).catch(err => {
            console.log('Default catch entered');
            res.end('Database Error')
            console.log(err);
        })
    });
    
    app.get('/api/article/:id', (req, res) => {
        db.Article.findById(req.params.id).then(data => {
            console.log(data);
            res.json(data);
        }).catch(err => {
            res.end('Database Error')
            console.log(err);
        })
    });

    app.post('/api/comment/:id', (req, res) => {
        db.Note.create({ text: req.body.text }).then(dbNote => {
            console.log('Note created');
            res.json(dbNote);
            return db.Article.findByIdAndUpdate(req.params.id, { $push: { notes: dbNote._id } })
        }).then(dbArticle => {
            console.log('Note added to array');
            // res.json(dbArticle);
        }).catch(err => {
            res.end('Database Error')
        })
    });

    app.post('/api/save/:id', (req, res) => {
        db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: true } }).then(data => {
            res.json(data);
        }).catch(err => {
            res.end('Database Error')
            console.log(err);
        })
    });

    app.post('/api/uncomment/:id', (req, res) => {
        db.Note.findByIdAndRemove(req.body.id).then(dbNote => {
            console.log('Trying to delete')
            console.log(dbNote);
            console.log(dbNote._id);
            return db.Article.findByIdAndUpdate(req.params.id, { $pull: { notes: dbNote._id } })
        }).then(dbArticle => {
            console.log('Note removed from array');
            res.json(dbArticle);
        }).catch(err => {
            res.end('Database Error')
        })
    });

    app.post('/api/unsave/:id', (req, res) => {
        db.Article.findByIdAndUpdate(req.params.id, { $set: { saved: false } }).then(data => {
            res.json(data);
        }).catch(err => {
            res.end('Database Error')
            console.log(err);
        })
    });

    app.get('/api/saved', (req, res) => {
        db.Article.find({ saved: true }).then(data => {
            res.json(data);
        }).catch(err => {
            res.end('Database Error')
            console.log(err);
        })
    });

    app.get('/api/scrape', (req, res) => {
        console.log('Trying to scrape')
        if (canScrapeAgain) {
            axios.get('https://apnews.com/').then(response => {
                let $ = cheerio.load(response.data);

                $('div.FeedCard').each((i, element) => {
                    let article = {
                        url: 'https://apnews.com' + $(element).find('a.headline').attr('href'),
                        headline: $(element).find('a.headline').text(),
                        summary: $(element).find('div.content').find('p').text()
                    }
                    db.Article.create(article).then(dbArticle => {
                        console.log(dbArticle);
                    }).catch(err => {
                        // console.log(err);
                    })
                });
                canScrapeAgain = false
                let timer = setTimeout(() => {
                    canScrapeAgain = true;
                }, 60 * 1000);
                console.log('Scrape Complete')
                res.end('Scrape Complete');
            }).catch(err => {
                res.end('Database Error')
                console.log(err);
            })
        } else {
            console.log('Scraped too recently');
            res.end('Scrape Complete');
        }
        
    });
}