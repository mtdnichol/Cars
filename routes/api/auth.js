const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const User = require('../../Database/Schemas/User')
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})

// @route         GET api/auth
// Description:   Test route
// Access:        public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // Return everything from user except password
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route         POST api/users
// Description:   Authenticate user & get token
// Access:        public
router.post('/',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){ // If errors exist, bad request has been made.  Return 400 error
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            let user = await User.findOne({ email })

            // See if user exists
            if(!user) {
                return res.status(400).json( {errors: [{msg: 'Invalid credentials'}]})
            }

            // Compare plaintext password to encrypted password to validate user
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) // Check if the given password matches the stored one
                return res.status(400).json( {errors: [{msg: 'Invalid credentials'}]})

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, process.env.jwtSecret, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server error')
        }
    })

module.exports = router