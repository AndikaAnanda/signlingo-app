const express = require('express')
const router = express.Router()
const { signup_get, login_get, logout_get, signup_post, login_post } = require('./authController')
const generateSpeech_post = require('./ttsController')
const { jwtAuth, checkUser } = require('../middleware/authMiddleware')
const predict_post = require('./mlController')

// apply checkUser to all GET method
router.get('*', checkUser)

router.get('/signup', signup_get)
router.get('/login', login_get)
router.get('/logout', logout_get)

router.post('/signup', signup_post)
router.post('/login', login_post)
router.post('/generate-speech', generateSpeech_post)
router.post('/predict', predict_post)

module.exports = (app) => {
    app.use(router)
}