const path = require('path')
const fs = require('fs')

const convertWord_post = async (req, res) => {
    try {
        const { word } = req.query
        // check if word doesn't exist word contain symbol or number
        if(!word || !/^[a-zA-Z]+$/.test(word)) {
            res.status(400).json({
                message: "Invalid word provided"
            })
        }
        const letters = word.split('')
        const images = letters.map(
            letter => {
                const imagePath = path.join(__dirname, 'sign_letters', `${letter.toUpperCase()}.png`)
                return fs.existsSync(imagePath) ? `https://localhost:3000/public/images/${letter.toUpperCase()}.png` : null
            }
        )
        res.status(201).json({
            word,
            images
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = convertWord_post