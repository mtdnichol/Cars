const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: { //Refers to the id of another object, relational
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    location: { // Users geographical location, could be used for meetups
        type: String
    },
    bio: { // User bio to describe themselves on their profile.  May not be necessary
        type: String
    },
    cars: { // Array of cars related to all the cars the user owns / has owned on their profile
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'car'
    }
})