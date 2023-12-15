const express = require('express')
const router = express.Router()
const { signup_get, login_get, signup_post, login_post } = require('./authController')

router.get('/signup', signup_get)
router.get('/login', login_get)
router.post('/signup', signup_post)
router.post('/login', login_post)

module.exports = (app) => {
    app.use(router)
}