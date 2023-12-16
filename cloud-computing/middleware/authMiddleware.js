const jwt = require('jsonwebtoken')
const { getEmailById } = require('../model/user')

const jwtAuth = (req, res, next) => {
    const token = req.cookies.jwt
    // check jwt is exist & verified
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (error, decodedToken) => {
            if (error) {
                console.log(error)
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    // check jwt is exist & verified
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken) => {
            if (error) {
                console.log(error)
                res.locals.user = null
                next()
            } else {
                console.log(decodedToken)
                res.locals.user = await getEmailById(decodedToken.id)
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { jwtAuth, checkUser }