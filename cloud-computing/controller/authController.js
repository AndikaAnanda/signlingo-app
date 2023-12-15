const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
const jwt = require('jsonwebtoken')
const { createUser, getUserByEmail } = require('../model/user')

// session expire long (in seconds)
const maxSession = 3 * 24 * 60 * 60

// function for create jwt token
const createToken = (id) => {
    return jwt.sign({ id }, 'my_secret', {
        expiresIn: maxSession
    })
}

const signup_get = async (req, res) => {
    res.send('<html><body><h1>SIGNUP PAGE</h1></body></html>')
}

const login_get = async (req, res) => {
    res.send('<html><body><h1>LOGIN PAGE</h1></body></html>')
}

const signup_post = async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exist'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const id = nanoid(10)
        await createUser(id, email, hashedPassword)
        const token = createToken(id)
        // store token to cookies
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxSession * 1000
        })
        res.status(201).json({
            message: 'User successfully signed in'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const login_post = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await getUserByEmail(email)
        if (!user || user === undefined) {
            return res.status(401).json({
                message: 'No users found'
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Invalid password'
            })
        }
        const token = createToken(user.id)
        // store token to cookies
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxSession * 1000
        })
        return res.json({token})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = { signup_get, login_get, signup_post, login_post }