const express = require('express')
const router = express.Router()
const { register_get, login_get, logout_get, register_post, login_post } = require('./authController')
const signToText_get = require('./signToTextController')
const textToSign_post = require('./textToSignController')
const { favorites_post, favorites_get } = require('./favoritesController')
const { jwtAuth, checkUser } = require('../middleware/authMiddleware')
const upload = require('../middleware/imageMiddleware')

// apply checkUser to all GET method
// router.get('*', checkUser)

router.get('/register', register_get)
router.get('/login', login_get)
router.get('/logout', logout_get)
router.get('/welcome')
router.get('/home')
router.get('/history')
router.get('/text-to-sign')
router.get('/text-to-sign/results')
router.get('/sign-to-text/results')

router.post('/register', register_post)
router.post('/login', login_post)
router.get('/sign-to-text', signToText_get)
router.post('/text-to-sign', textToSign_post)

router.get('/favorites', favorites_get)
router.post('/favorites', favorites_post)

module.exports = (app) => {
    app.use(router)
}