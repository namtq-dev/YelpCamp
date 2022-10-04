const { default: axios } = require('axios');
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

const seedImg = async () => {
    try {
        const config = {
            params: {
                client_id: '3_RPTHhxgDesRw0MOjqA1Eday3A3w2khx8T-rJHC9SE',
                collections: 429524
            }
        };
        const res = await axios.get('https://api.unsplash.com/photos/random', config);
        return res.data.urls.small;
    } catch (err) {
        console.error(err);
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 25; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`,
            image: await seedImg(),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim autem quis sequi, eligendi alias iusto maiores vero est, minus magnam quasi temporibus natus pariatur tempore? Magnam recusandae corporis esse animi.',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})