const jwt = require('jsonwebtoken')
const { getEmailById } = require('../model/user')

// session expire long (in seconds)
const maxSession = 3 * 24 * 60 * 60

// function for create jwt token
const createToken = (id) => {
    return jwt.sign({ id }, "bangkit2023", {
        expiresIn: maxSession
    })
}

const jwtAuth = (req, res, next) => {
    const token = req.cookies.jwt
    // check jwt is exist & verified
    if (token) {
        jwt.verify(token, "bangkit2023", (error, decodedToken) => {
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
        jwt.verify(token, "bangkit2023", async (error, decodedToken) => {
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

module.exports = { maxSession, createToken, jwtAuth, checkUser }