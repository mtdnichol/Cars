const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(new Date().toISOString() + '-' + file.originalname) // Date iso ensures unique file names
    }
})

/*
Image Types:
image/apng: Animated Portable Network Graphics (APNG)
image/avif : AV1 Image File Format (AVIF)
image/gif: Graphics Interchange Format (GIF)
image/jpeg: Joint Photographic Expert Group image (JPEG)
image/png: Portable Network Graphics (PNG)
image/svg+xml: Scalable Vector Graphics (SVG)
image/webp: Web Picture format (WEBP)
*/

// Filter for allowed image types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb({ message: 'Unsupported file format' }, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max file size 10mb
        files: 5 // Maximum number of files uploaded per request

    },
    fileFilter: fileFilter
})

module.exports = upload