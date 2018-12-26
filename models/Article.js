let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

let Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;