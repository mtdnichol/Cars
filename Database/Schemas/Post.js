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
    text: { // Caption to describe the photo in the post
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
            required: true
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
        date: { // Date the comment was created
            type: Date,
            default: Date.now()
        }
    }],
    location: { // Location the photo was taken
        type: String
    },
    photos: [{ // Cloudinary photo route for associated photo with the post
        publicID: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
})

module.exports = Post = mongoose.model('post', PostSchema)