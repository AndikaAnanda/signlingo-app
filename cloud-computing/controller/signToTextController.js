const { loadModel, predict } = require('../model/mlModel')
const { Storage } = require('@google-cloud/storage')
const fs = require('fs').promises
const path = require('path')
const fetch = require('cross-fetch')

const projectId = process.env.GOOGLE_CLOUD_PROJECT
const bucketName = "signlingo-photoshot-results"
// const imagePath = '../public/images/test.jpg'

const storage = new Storage({
    projectId: projectId,
    keyFilename: 'C:\\Users\\User\\OneDrive\\Desktop\\SignLingo-main\\cloud-computing\\serviceAccounts.json'
})

const signToText_get = async (req, res) => {
    try {
        const { image } = req.body
        const model = await loadModel()
        const file = storage.bucket(bucketName).file(image)

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000
        })

        // fetch the image
        const response = await fetch(url)
        const fileBuffer = await response.arrayBuffer()

        const predictions = await predict(model, fileBuffer)

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

const uploadSign_post = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    
      const file = bucket.file(req.file.originalname);
      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
    
      stream.on('error', (err) => {
        console.error(err);
        res.status(500).send('Error uploading file.');
      });
    
      stream.on('finish', () => {
        res.status(200).send('File uploaded successfully.');
      });
    
      stream.end(req.file.buffer);
}

module.exports = signToText_get