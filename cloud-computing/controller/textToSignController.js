const path = require('path')
const https = require('https');
const fs = require('fs')
const { Storage, Iam } = require('@google-cloud/storage')

const storage = new Storage({
    projectId: 'signlingo-app',
    keyFilename: path.join(__dirname, '..', 'key.json')
})
const bucketName = 'signlingo-images'
const folderName = 'sign-letters'
const favoriteFolder = 'favorite-images'

const textToSign_post = async (req, res) => {
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
            const imagePath = `${folderName}/${letter.toLowerCase()}.jpg`
            
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
            const favoriteFolderPath = `${favoriteFolder}/${text}`;

            // Create a writable stream to the file
            const fileStream = storage.bucket(bucketName).file(`${favoriteFolderPath}/`).createWriteStream();
            await new Promise ((resolve) => fileStream.end(resolve))

            await Promise.all(images.map(async (imageUrl, index) => {
                if (imageUrl) {
                    const imageBuffer = await fetchImageBuffer(imageUrl);
                    const uniqueFilename = `${index}-${imageUrl.split('/').pop()}`
                    const destinationPath = `${favoriteFolderPath}/${uniqueFilename}`
                    const cleanedDestinationPath = destinationPath.replace(/sign-letters%2F/g, '');
                    await storage.bucket(bucketName).file(cleanedDestinationPath).save(imageBuffer, {
                        metadata: {
                            contentType: 'image/jpg'
                        }
                    })
                }
            }));
            
        }
        await performImageCleanup(bucketName, favoriteFolder, 10)
        
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

        const favorites = files.reduce((acc, file) => {
            const [text, image] = file.name.split('/').slice(1)
            const imageUrl = file.publicUrl()

            // Skip entries with empty text
            if (!text || !image) {
                return acc;
            }

            const entry = acc.find(entry => entry.text === text) || {
                text,
                images: []
            }
            entry.images.push(imageUrl)

            if (!acc.some(entry => entry.text === text)) {
                acc.push(entry)
            }
            return acc
        }, [])
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

async function fetchImageBuffer(url) {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        const req = https.get(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        });

        req.on('error', (err) => reject(err));
    });
}

const performImageCleanup = async (bucketName, folderName, maxSize) => {
    const bucket = storage.bucket(bucketName)
    const files = await bucket.getFiles({
        prefix: folderName
    })
    if (files[0].length > maxSize) {
        const filesToDelete = files[0].slice(0, files[0].length - maxSize)
        // delete oldest file
        await Promise.all(filesToDelete.map((file) => file.delete()))
    }
}


module.exports = { textToSign_post, favorites_get }