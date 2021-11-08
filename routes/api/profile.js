const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const Profile = require('../../Database/Schemas/Profile')

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

module.exports = router