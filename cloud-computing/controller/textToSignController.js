const path = require('path')
const fs = require('fs')
const { Storage, Iam } = require('@google-cloud/storage')

const storage = new Storage({
    projectId: 'signlingo-app',
    keyFilename: path.join(__dirname, '..', 'key.json')
})
const bucketName = 'signlingo-images'
const folderName = 'sign-letters'
const favoriteFolder = 'favorite-images'

const textToSign_get = async (req, res) => {
    try {
        const { text, isFavorite } = req.body
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
        
        // add result to favorite storage if isFavorite = true
        if (isFavorite) {
            const favoriteFolderPath = `${bucketName}/${favoriteFolder}/${text}`
            await storage.bucket(bucketName).file(favoriteFolderPath).create()
            await Promise.all(images.map(async (imageUrl, index) => {
                if (imageUrl) {
                    const destinationPath = `${favoriteFolderPath}/${index}.jpg`
                    await storage.bucket(bucketName).upload(imageUrl, {
                        destination: destinationPath
                    })
                }
            }))
        }
        res.status(201).json({
            text,
            images,
            isFavorite
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const favorites_get = async (req, res) => {
    try {
        const [files] = await storage.bucket(bucketName).getFiles({
            prefix: favoriteFolder
        })

        const favorites = files.map(file => {
            const text = file.name.split('/')[1]
            const imageUrl = file.publicUrl()
            return {
                text,
                images: [imageUrl]
            }
        })
        res.status(200).json({
            favorites: favorites
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


module.exports = { textToSign_get, favorites_get }