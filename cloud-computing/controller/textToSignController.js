const path = require('path')
const fs = require('fs')
const { Storage } = require('@google-cloud/storage')

const storage = new Storage({
    projectId: 'signlingo-app',
    keyFilename: path.join(__dirname, '..', 'key.json')
})
const bucketName = 'signlingo-images'
const folderName = 'sign-letters'

const textToSign_get = async (req, res) => {
    try {
        const { text } = req.body
        // check if word doesn't exist or word contain symbol or number
        if(!text || !/^[a-zA-Z\s]+$/.test(text)) {
            res.status(400).json({
                message: "Invalid word provided"
            })
        }
        const letters = text.split('')
        const images = await Promise.all(letters.map(async (letter) => {
            const imagePath = `${bucketName}/${folderName}/${letter.toUpperCase()}.png`
            
            try {
                // Check if the file exists in Google Cloud Storage
                await storage.bucket(bucketName).file(imagePath).getMetadata();
                
                // If the file exists, return the public URL
                return storage.bucket(bucketName).file(imagePath).publicUrl();
            } catch (error) {
                console.error(`Error fetching image for ${letter}:`, error);
                return null;
            }
        }));
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

module.exports = textToSign_get