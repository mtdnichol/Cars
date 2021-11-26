const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const {check, validationResult} = require("express-validator");
const Profile = require('../../Database/Schemas/Profile')
const Car = require('../../Database/Schemas/Car')
const Post = require('../../Database/Schemas/Post')
const User = require('../../Database/Schemas/User')

// @route         GET api/profile/me
// Description:   Get current users profile, along with their associated posts
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
router.post('/',
    check(),
    auth, async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){ // If errors exist, bad request has been made.  Return 400 error
            return res.status(400).json({ errors: errors.array() })
        }

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
        const posts = await Post.find({ user: req.params.id }).sort({ date: -1 })

        if (!profile) return res.status(400).json({ msg: 'Profile not found' })

        res.json({
            profile,
            posts
        })
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

// @route         PUT api/profile/follow/:id
// Description:   Follow or unfollow a user
// Access:        Private
router.put('/follow/:id', auth, async (req, res) => {
    try {
        const currUser = await Profile.findById(req.user.id) // Current user that wants to follow targetUser
        const targetUser = await Profile.findById(req.params.id) // User that is being followed

        // Check if the target user exists
        if (!targetUser)
            return res.status(404).json({ msg: 'Target user not found' })

        // Check if the current user exists
        if (!currUser)
            return res.status(400).json({ msg: 'Current user not found' })

        // Check if current user already follows the other user
        if (targetUser.followers.filter(follow => follow.user.toString() === req.user.id).length > 0) {
            //User already follows the other user, begin unfollowing
            const currUserRemoveIndex = currUser.following.map(follow => follow.user.toString()).indexOf(req.params.id)
            const targetUserRemoveIndex = targetUser.followers.map(follow => follow.user.toString()).indexOf(req.user.id)

            // Remove target user from following and current user from target user's followers
            currUser.following.splice(currUserRemoveIndex, 1)
            targetUser.followers.splice(targetUserRemoveIndex, 1)

            await currUser.save()
            await targetUser.save()

            const targetFollowers = targetUser.followers
            const userFollowing = currUser.following

            return res.json({
                targetFollowers,
                userFollowing
            })
        }

        //User has not yet followed, complete follow request

        // Append target user to current user following
        // Append current user to target user followers
        currUser.following.unshift({ user: targetUser.user })
        targetUser.followers.unshift({ user: req.user.id })

        await currUser.save()
        await targetUser.save()

        // Cannot directly return object.property in res.json with {}
        const targetFollowers = targetUser.followers
        const userFollowing = currUser.following

        res.json({
            targetFollowers,
            userFollowing
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router