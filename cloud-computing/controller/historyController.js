const { Storage } = require('@google-cloud/storage')
const fs = require('fs').promises
const path = require('path')

const storage = new Storage({
    projectId: 'signlingo-app',
    keyFilename: path.join(__dirname, '..', 'key.json')
})

const bucketName = 'signlingo-images'
const folderName = 'sign-to-text-results'

const history_get = async (req, res) => {
    try {
        const history = await getImageUrls(bucketName, folderName)
        res.status(200).json({
            message: `Successfully retrieving history`,
            history
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

// function for retrieving letter and corresponding images public URL
const getImageUrls = async (bucketName, folderName) => {
    const bucket = storage.bucket(bucketName)
    const files = await bucket.getFiles({
        prefix: folderName
    })
    const imageUrls = files[0].map((file) => {
        const matches = file.name.match(/image-([A-Z])-\d+\.jpg/)
        const letter = matches ? matches[1] : null
        const url = `https://storage.googleapis.com/${bucketName}/${file.name}`
        return {
            letter,
            url
        }
    })
    return imageUrls
}

module.exports = history_get