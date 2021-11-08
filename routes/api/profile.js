const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const Profile = require('../../Database/Schemas/Profile')
const Car = require('../../Database/Schemas/Car')
const Post = require('../../Database/Schemas/Post')
const User = require('../../Database/Schemas/User')

// @route         GET api/profile/me
// Description:   Get current users profile
// Access:        Private (Getting the current users ID)
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile)
            return res.status(400).json({ msg: 'There is no profile for this user' })

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route         POST api/profile/
// Description:   Create or update own profile
// Access:        Private (Authenticates the current users ID)
router.post('/', auth, async (req, res) => {
    const {
        bio,
        organization,
        youtube,
        twitter,
        facebook,
        instagram
    } = req.body

    const profileFields = {}

    // Build all fields based on input information
    profileFields.user = req.user.id
    if (bio) profileFields.bio = bio
    if (organization) profileFields.organization = organization

    // Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram

    try {
        let profile = Profile.findOne({ user: req.user.id }) // See if user exists

        if (profile) { // Update if exists
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields},
                {new: true})

            return res.json(profile)
        }

        //Create new profile if not existing
        profile = new Profile(profileFields)
        await profile.save();

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route         GET api/profile/
// Description:   Get all profiles
// Access:        Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route         GET api/profile/user/:user_id
// Description:   Get profile by user ID
// Access:        Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({ msg: 'Profile not found' })

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId')
            return res.status(400).json({ msg: 'Profile not found' })

        res.status(500).send('Server Error')
    }
})

// @route         DELETE api/profile/delete
// Description:   Delete profile, user, and their posts
// Access:        Private
router.get('/', auth, async (req, res) => {
    try {
        // Remove all attributes associated with a user
        await Profile.findOneAndRemove({ user: req.user.id })
        await Post.remove({ user: req.user.id })
        await Car.remove({ user: req.user.id })

        //Remove user itself last,
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: 'User deleted' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router