const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    newsId: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
    author: {
        type: String,
        default: 'Anonymous',
        required: false
    },
    comment: {
        type: String,
        required: true
    }

});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;