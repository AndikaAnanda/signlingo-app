const { loadModel, predict } = require('../model/mlModel')

const predict_post = async (req, res) => {
    try {
        const { image } = req.body
        const model = await loadModel()
        const predictions = predict(model, image)
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

module.exports = predict_post