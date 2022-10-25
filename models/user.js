const passportLocalMon = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true, 
        unique: true // this field set up index, not validation
    }
})

// Automatically add on username and password fields for User model
userSchema.plugin(passportLocalMon);

module.exports = mongoose.model('User', userSchema);