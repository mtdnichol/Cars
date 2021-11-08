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
    organization: { // Name of organization if user has a store or car organization
        type: String
    },
    social: { // Links to other social media platforms that the user may post on
        youtube: { // Youtube.com
            type: String
        },
        twitter: { // Twitter.com
            type: String
        },
        facebook: { // Facebook.com
            type: String
        },
        instagram: { // Instagram.com
            type: String
        }
    },
    date: { // Date the account profile was created
        type: Date,
        default: Date.now()
    }
})

module.exports = User = mongoose.model('profile', ProfileSchema)