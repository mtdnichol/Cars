const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})
const connectDB = require('./Database/db')

const app = express()

//Connect Database
connectDB()

//Initialize middleware
app.use(express.json())

app.get('/', ((req, res) => res.send('API Running')))

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = 5000 || process.env.PORT
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))