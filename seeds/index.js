const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

connectDB().catch(err => console.log(err));
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

async function connectDB() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('Connected to the MongoDB Server');
}

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})