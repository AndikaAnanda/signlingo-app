const tfjs = require('@tensorflow/tfjs-node')

let model

const loadModel = async () => {
    const modelUrl = '#FILL WITH BUCKET URL'
    if (!model) {
        model = await tfjs.loadLayersModel(modelUrl)
    }
    return model
}

const predict = async (model, imageBuffer) => {
    const tensor = tfjs.node
    .decodeJpeg(imageBuffer)
    .resizeNearestNeighbor([150, 150])
    .expandDims()
    .toFloat()

    const predictions = await model.predict(tensor).data()
    return predictions
}

module.exports = { loadModel, predict}