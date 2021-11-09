const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check')

const Post = require('../../Database/Schemas/Post')
const User = require('../../Database/Schemas/User')
const Profile = require('../../Database/Schemas/Profile')
const Car = require('../../Database/Schemas/Car')

// @route         POST api/posts
// Description:   User creates a new post
// Access:        private
// Since a user can post strictly a photo, no validation other than the photo is required
router.post('/', auth,
    check(), // Insert photo validation here
    async (req, res) => {
    //@todo Add image validation
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        //@todo May have to update to accept many photos when cloudinary is implemented
        const {
            caption,
            tags,
            location,
            photo
        } = req.body

        try {
            const postFields = {}
            postFields.user = req.user.id
            if (location) postFields.location = location
            if (caption) postFields.caption = caption
            if (tags) postFields.tags = tags.split(',').map(tag => tag.trim())
            postFields.photo = photo

            const post = await postFields.save()

            res.json(post)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
})

// @route         GET api/posts/
// Description:   Get all posts
// Access:        Private (Must be logged in to see posts)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }) // All posts ordered by newest

        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route         GET api/posts/:id
// Description:   Get a post by its id
// Access:        Private (Must be logged in to see posts)
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)// All posts ordered by newest

        if (!post)
            return res.status(404).json({msg: 'Post not found'})

        res.json(post)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId')
            return res.status(404).json({msg: 'Post not found'})
        res.status(500).send('Server Error')
    }
})

//@todo Check if there will be conflicts between post by post ID and UserID
// @route         GET api/posts/:user_id
// Description:   Get all posts by a users' ID
// Access:        Private (Must be logged in to see posts)
router.get('/:user_id', auth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })// All posts ordered by newest

        if (!posts)
            return res.status(404).json({msg: 'User not found'})

        res.json(posts)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId')
            return res.status(404).json({msg: 'User not found'})
        res.status(500).send('Server Error')
    }
})

// @route         DELETE api/posts/:id
// Description:   Delete a post
// Access:        Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post)
            return res.status(404).json({ msg: 'Post not found' })

        // Ensure the user that deletes the post owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }

        await post.remove();

        res.json({ msg: 'Post removed' })
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId')
            return res.status(404).json({msg: 'Post not found'})
        res.status(500).send('Server Error')
    }
})

module.exports = router