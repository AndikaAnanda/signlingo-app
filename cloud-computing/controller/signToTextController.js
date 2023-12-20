const { loadModel, predict } = require('../model/mlModel')
const { Storage } = require('@google-cloud/storage')
const fs = require('fs').promises
const path = require('path')

const storage = new Storage({
    projectId: 'signlingo-app',
    keyFilename: 'C:\\Users\\User\\OneDrive\\Desktop\\SignLingo-main\\cloud-computing\\serviceAccounts.json'
})
const bucketName = 'signling-photoshot-results'

const signToText_post = async (req, res) => {
    const model = await loadModel()
    try {
        const imageBuffer = req.file.buffer
        const predictions = await predict(model, imageBuffer)

        // save image to cloud storage
        const filename = `image-${Date.now()}.jpg`
        await saveToCloudStorage(bucketName, filename, imageBuffer)
        res.status(201).json({
            message: `Prediction result: ${predictions}`
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const saveToCloudStorage = async (bucketName, filename, fileBuffer) => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const stream = file.createWriteStream({
        metadata: {
            contentType: 'image/jpeg', // set the appropriate content type
        },
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
            reject(error);
        });

        stream.on('finish', () => {
            resolve();
        });

        stream.end(fileBuffer);
    });
}

module.exports = signToText_post