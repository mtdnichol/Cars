const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: { // Name, eg. Michael Nichol
        type: String,
        required: true
    },
    email: { // Email, doubles as username for login purposes
        type: String,
        required: true,
        unique: true
    },
    password: { // Password, hashed with bcrypt
        type: String,
        required: true
    },
    token: {
        key: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        expires: {
            type: Number
        }
    },
    avatar: { // Avatar linked to cloudinary image
        publicID: {
            type: String,
            required: true,
            default: ''
        },
        url: {
            type: String,
            required: true,
            default: 'https://res.cloudinary.com/carsapp/image/upload/v1636927678/resources/default_user_f4m6wc.png'
        },
        default: {
            type: Boolean,
            default: true
        }
    },
    date: { // Account creation date, cannot be modified
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema)