const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
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