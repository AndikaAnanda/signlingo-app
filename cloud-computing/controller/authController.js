const bcrypt = require('bcrypt')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { createUser, getUserByEmail } = require('../model/user')

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
        console.log(hashedPassword)
        await createUser(email, hashedPassword)
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
        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, 'secret_key')
        return res.json({token})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = { signup_get, login_get, signup_post, login_post }