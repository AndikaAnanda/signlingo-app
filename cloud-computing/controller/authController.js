const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
const { createUser, getUserByEmail, getUserByName } = require('../model/user')
const { createToken, maxSession } = require('../middleware/authMiddleware')


const register_get = async (req, res) => {
    res.send('<html><body><h1>REGISTER PAGE</h1></body></html>')
}

const login_get = async (req, res) => {
    res.send('<html><body><h1>LOGIN PAGE</h1></body></html>')
}

const logout_get = async (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/welcome')
}

const register_post = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        const existingUserEmail = await getUserByEmail(email)
        const existingUserName = await getUserByName(name)
        if (existingUserEmail) {
            return res.status(400).json({
                message: 'Email already taken'
            })
        } else if (existingUserName) {
            return res.status(400).json({
                message: 'Name already taken'
            })
        }
        if (password != confirmPassword) {
            return res.status(400).json({
                message: "Your re-enter different password"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const id = nanoid(10)
        await createUser(id, name, email, hashedPassword)
        const token = createToken(id)
        // store token to cookies
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxSession * 1000
        })
        res.status(201).json({
            message: 'User successfully registered'
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

module.exports = { register_get, login_get, logout_get, register_post, login_post }