const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const ExpressError = require('./helpers/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

connectDB().catch(err => console.log(err));
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

async function connectDB() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('Connected to the MongoDB Server');
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campgrounds', campgroundRoutes);

app.use('/campgrounds/:id/reviews', reviewRoutes); //Router get separate params

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})