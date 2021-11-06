const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token')

    // Check if no token exists
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' }) // 401 is not authorized

    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret) // Decode the token

        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' })
    }
}