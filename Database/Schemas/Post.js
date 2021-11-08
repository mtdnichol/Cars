const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: { //Refers to the id of another object, relational
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'car'
    },
    date: { // Date the post was created
        type: Date,
        default: Date.now
    },
    caption: { // Caption to describe the photo in the post
        type: String
    },

    // Name and avatar are redundantly stored in case a user deletes their profile, might be an oversight, can remove
    // and ref user through ID directly
    name: { // Stores the posters display name
        type: String
    },
    avatar: { // Stores the posters avatar
        type: String
    },
    likes: [{ // Array of users who like the post
        user: { // Only allows the user to like a post once
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    tags: [{ // Tags a user may associate with their post to group it with other like posts
        text: {
            type: String,
            required: true,
            unique: true
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        text: { // Main text body for a comment
            type: String,
            required: true
        },
        name: { // Name of user who commented
            type: String,
        },
        avatar: { // Avatar of user who commented
            type: String,
        },
        date: { // Date the comment was created
            type: Date,
            default: Date.now()
        }
    }],
    location: { // Location the photo was taken
        type: String
    },
    photo: [{ // Cloudinary photo route for associated photo(s) with the post
        filepath: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    }]
})

module.exports = User = mongoose.model('post', PostSchema)