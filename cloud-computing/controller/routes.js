const express = require('express')
const router = express.Router()
const { register_get, login_get, logout_get, register_post, login_post } = require('./authController')
const { signToText_post, history_get } = require('./signToTextController')
const { textToSign_post, favorites_get } = require('./textToSignController')
const { jwtAuth, checkUser } = require('../middleware/authMiddleware')
const upload = require('../middleware/imageMiddleware')

// apply checkUser to all GET method
// router.get('*', checkUser)

// auth
router.post('/register', register_post)
router.post('/login', login_post)
router.get('/logout', logout_get)

// sign-to-text
router.post('/sign-to-text', upload.single('image'), signToText_post)
router.get('/history', history_get)

// text-to-sign
router.post('/text-to-sign', textToSign_post)
router.get('/favorites', favorites_get)


module.exports = (app) => {
    app.use(router)
}