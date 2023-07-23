const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('nice db')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            owner: '64b119265cdc250f2bf2ceb0',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dd9trxmnc/image/upload/v1689760077/YelpCamp/y9nadwiphptnvljw9bmv.jpg',
                    filename: 'YelpCamp/y9nadwiphptnvljw9bmv',
                },
                {
                    url: 'https://res.cloudinary.com/dd9trxmnc/image/upload/v1689760080/YelpCamp/elpfetgb8qqbwk06iple.jpg',
                    filename: 'YelpCamp/elpfetgb8qqbwk06iple',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quod placeat quibusdam, odio praesentium blanditiis eveniet. Pariatur recusandae necessitatibus delectus rem ad, similique numquam, ratione libero mollitia, autem dolorem nesciunt!',
            price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})