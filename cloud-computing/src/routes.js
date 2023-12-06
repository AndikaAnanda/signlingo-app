const express = require('express')
const router = express.Router()
const { signup, login } = require('./handlers')

router.post('/signup', signup)
router.post('/login', login)

module.exports = (app) => {
    app.use('/api', router)
}