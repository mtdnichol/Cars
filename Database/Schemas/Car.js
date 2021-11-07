const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema({
    handle: { // Handle for if the user has a nickname for their car
        type: String
    },
    make: { // Make of the car, eg. Ford
        type: String,
        required: true
    },
    model: { // Model of the car, eg. Mustang
        type: String,
        required: true,
    },
    year: { // Year the car was first built by the manufacturer
        type: Number,
        required: true
    },
    from: { // Date that the user began owning the car
        type: Date,
        required: true
    },
    to: { // Date the user released their car / no longer owns it
        type: Date
    },
    avatar: { // Cloudinary file location of the main display photo of their car
        filepath: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    },
    description: { // Bio of the users car
        type: String
    },
    modifications: { // List of modifications that the user has done to their car
        type: [String]
    },
    date: { // Date the car was created on server for serverside purposes
        type: Date,
        default: Date.now
    },
    post: [{ // Posts related to a given car, might want to move to own schema and relate back to a car
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
    }]

})

module.exports = User = mongoose.model('user', CarSchema)