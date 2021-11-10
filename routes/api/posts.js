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
        const post = await Post.findById(req.params.id) // Query posts by relation to car

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

// @route         PUT api/posts/like/:id
// Description:   Like or unlike a post
// Access:        Private
// Note:          My application will only have one like button, therefore like and dislike can be handled in the same put
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Check if the post exists
        if (!post)
            return res.status(404).json({ msg: 'Post not found' })

        // Check if the post has already been liked by the current user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) { // Iterate over liked user ids
            // User already likes the post, begin dislike
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

            // Remove user from a posts likes
            post.likes.splice(removeIndex, 1)

            await post.save()

            return res.json(post.likes)
        }

        //User has not yet liked, complete like request

        post.likes.unshift({ user: req.user.id }) // Unshift appends to the beginning of the array

        await post.save()

        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @todo Make comments have threads, current architecture only supports single comments on post
// @route         POST api/posts/comment/:id
// Description:   User creates a comment on a post
// Access:        private
router.post('/comment/:id', auth,
    check('text', 'Text is required').not().isEmpty(), // Insert photo validation here
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        try {
            const post = await Post.findById(req.params.id)

            // Error is related to the date field in comment model, ignore
            post.comments.unshift({
                user: req.user.id,
                text: req.body.text
            })

            await post.save()

            res.json(post.comments)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    })

// @route         POST api/posts/comment/:id/:comment_id
// Description:   Delete a comment
// Access:        private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Get target comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // Check that the comment exists
        if (!comment)
            return res.status(404).json({ msg: 'Comment does not exist' })

        // Check user owns comment
        if (comment.user.toString() !== req.user.id)
            return res.status(401).json({ msg: 'User not authorized' })

        const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id)
        if (!comment)
            return res.status(404).json({ msg: 'Comment does not exist' })

        // Remove the comment
        post.comments.splice(removeIndex, 1)
        await post.save()

        res.json(post.comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router