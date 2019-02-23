const mongoose = require('mongoose');

const config = require('./config');

const User = require('./models/User');
const News = require('./models/News');


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
        await db.dropCollection('photos');

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


    const news = await News.create({
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

    db.close();

});