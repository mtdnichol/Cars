const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})
const { check, validationResult } = require('express-validator');

const User = require('../../Database/Schemas/User')

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

            // Get user gravatar
            const avatar = gravatar.url(email, {
                s: 200, //Default size
                r: 'pg', //No naked people
                d: 'mm' //Gives a default image without gravatar
            })

            user = new User({ name, email, avatar, password })

            //Encrypt password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            //Save user
            await user.save()

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

module.exports = router