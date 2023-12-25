const { loadModel, predict } = require('../model/mlModel')
const { Storage } = require('@google-cloud/storage')
const fs = require('fs').promises
const path = require('path')

const storage = new Storage({
    projectId: 'signlingo-app',
    keyFilename: path.join(__dirname, '..', 'key.json')
})
const bucketName = 'signlingo-images'
const folderName = 'sign-to-text-results'

const signToText_post = async (req, res) => {
    const model = await loadModel()
    try {
        const imageBuffer = req.file.buffer
        const predictions = await predict(model, imageBuffer)

        // find index of the maximum value on predictions array
        const maxIndex = predictions.indexOf(Math.max(...predictions))
        console.log(Math.max(...predictions))

        // get corresponding letter from maxIndex
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const predictedLetter = alphabet[maxIndex]
        console.log(predictedLetter)

        // save image to cloud storage
        const filename = `${folderName}/image-${predictedLetter}-${Date.now()}.jpg`
        await saveToCloudStorage(bucketName, filename, imageBuffer)

        // perform cleanup if number of images exceed the limit
        await performImageCleanup(bucketName, folderName, 10)

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

module.exports = signToText_post