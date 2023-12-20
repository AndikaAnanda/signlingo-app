const { loadModel, predict } = require('../model/mlModel')
const fs = require('fs').promises
const path = require('path')


const signToText_post = async (req, res) => {
    const model = await loadModel()
    try {
        const imageBuffer = req.file.buffer
        const predictions = await predict(model, imageBuffer)
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

module.exports = signToText_post