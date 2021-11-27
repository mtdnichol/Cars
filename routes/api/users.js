const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config({path: './config/.env'})
const { check, validationResult } = require('express-validator');

const User = require('../../Database/Schemas/User')
const Profile = require('../../Database/Schemas/Profile')
const nodemailer = require("nodemailer");

// @route         POST api/users
// Description:   Register a new user
// Access:        public
router.post('/',
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password greater than 6 characters').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){ // If errors exist, bad request has been made.  Return 400 error
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body
        console.log(req.body)

        try {
            let user = await User.findOne({ email })

            // See if user exists
            if(user) {
                return res.status(400).json( {errors: [{msg: 'User already exists'}]})
            }

            //@todo Make a default avatar
            const avatar = {
                url: "ads",
                publicID: "asd"
            }

            user = new User({ name, email, avatar, password })

            //Encrypt password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            //Save user
            await user.save()

            //Create profile for user after a successful register
            const profile = new Profile({
                user: user.id
            })
            await profile.save()

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, process.env.jwtSecret, { expiresIn: 3600000 }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server error')
        }
})

// @route         POST api/profile/forgot
// Description:   Send recovery token to user
// Access:        Public
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json( {errors: [{msg: 'User not found'}]})
        }

        let resetToken = crypto.randomBytes(32).toString('hex')
        const hash = await bcrypt.hash(resetToken, 10)

        user.token = {
            key: hash,
            createdAt: Date.now()
        }

        await user.save()

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER, // generated ethereal user
                pass: process.env.GMAIL_PASSWORD, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: testAccount.user, // sender address
            to: user.email, // list of receivers
            subject: "Cars password reset", // Subject line
            text: resetToken
        });


        res.json({ msg: 'Email sent' })
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router