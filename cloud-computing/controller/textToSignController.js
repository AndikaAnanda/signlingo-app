const path = require('path')
const fs = require('fs')

const textToSign_post = async (req, res) => {
    try {
        const { text } = req.body
        // check if word doesn't exist or word contain symbol or number
        if(!text || !/^[a-zA-Z\s]+$/.test(text)) {
            res.status(400).json({
                message: "Invalid word provided"
            })
        }
        const letters = text.split('')
        const images = letters.map(
            letter => {
                const imagePath = path.join(__dirname, 'sign_letters', `${letter.toUpperCase()}.png`)
                return fs.existsSync(imagePath) ? `https://localhost:3000/public/images/${letter.toUpperCase()}.png` : null
            }
        )
        res.status(201).json({
            text,
            images
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = textToSign_post