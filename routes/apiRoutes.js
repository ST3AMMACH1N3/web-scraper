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
            res.json(data);
        }).catch(err => {
            res.end('Database Error')
            console.log(err);
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
                // canScrapeAgain = false
                // let timer = setTimeout(() => {
                //     canScrapeAgain = true;
                // }, 60 * 1000);
                console.log('Scrape Complete')
                res.send('Scrape Complete');
            }).catch(err => {
                res.end('Database Error')
                console.log(err);
            })
        } else {
            console.log('Scraped too recently');
            res.send('APNews has been scraped already recently');
        }
        
    });
}