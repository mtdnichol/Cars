const express = require('express')
const router = express.Router()

// @route         POST api/users
// Description:   Register a new user
// Access:        public
router.post('/', (req, res) => {
    console.log(req.body)
    res.send('User route')
})

module.exports = router