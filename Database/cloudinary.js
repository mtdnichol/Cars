const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv')
const {json} = require("express");

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}

remove = (public_id) => {
    cloudinary.uploader.destroy(public_id, function(result) { console.log(result) });
}

module.exports = { uploads, remove }

