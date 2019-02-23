const mongoose = require('mongoose');

const config = require('./config');

const User = require('./models/User');
const News = require('./models/News');
const Comment = require('./models/Comment');


mongoose.set('useCreateIndex', true);
mongoose.connect(config.db.url + '/' + config.db.name, {useNewUrlParser: true });


const db = mongoose.connection;

db.once('open', async () => {
    try{
        await db.dropCollection('users');

    }
    catch (e) {
        console.log('Collection Users where not present, skipping drop...');
    }
    try{
        await db.dropCollection('news');

    }
    catch (e) {
        console.log('Collection Photos where not present, skipping drop...');
    }
    try{
        await db.dropCollection('comments');

    }
    catch (e) {
        console.log('Collection Photos where not present, skipping drop...');
    }



    console.log('All collections is dropped');

    const [user, admin] = await User.create({
        username: 'test',
        password: 'test',
        role: 'user'
    },{
        username: 'admin',
        password: 'admin',
        role: 'admin'
    });
    console.log('Users created');


    const [news1, news2, news3, news4 ]= await News.create({
        title: 'test news 1',
        content: 'content for test news 1',
        image: 'noimage.jpeg',
        date: new Date()
    },{
        title: 'test news 2',
        content: 'content for test news 2',
        image: 'noimage.jpeg',
        date: new Date()
    },{
        title: 'test news 3',
        content: 'content for test news 3',
        image: 'noimage.jpeg',
        date: new Date()
    },{
        title: 'test news 4',
        content: 'content for test news 4',
        image: 'noimage.jpeg',
        date: new Date()
    });
    console.log('News created');

    const comment = await Comment.create({
        newsId: news1._id,
        comment: "comment1 for news 1"
    },{
        newsId: news1._id,
        comment: "comment2 for news 1",
        author: admin.username
    },{
        newsId: news2._id,
        comment: "comment1 for news 2"
    },{
        newsId: news2._id,
        comment: "comment2 for news 2",
        author: user.username
    },{
        newsId: news3._id,
        comment: "comment1 for news 3"
    },{
        newsId: news3._id,
        comment: "comment2 for news 3",
    },{
        newsId: news4._id,
        comment: "comment1 for news 4",
        author: user.username
    },{
        newsId: news4._id,
        comment: "comment2 for news 4",
        author: admin.username
    });
    console.log('Comments created');



    db.close();

});