const jwt = require('jsonwebtoken')

const jwtAuth = (req, res, next) => {
    const token = req.cookies.jwt
    // check jwt is exist & verified
    if (token) {
        jwt.verify(token, 'bangkit2023', (error, decodedToken) => {
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

module.exports = jwtAuth