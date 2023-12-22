const tfjs = require('@tensorflow/tfjs-node')

const loadModel = async () => {
    const modelUrl = 'https://storage.googleapis.com/signlingo-ml-model/modelfix/model.json'
    return tfjs.loadLayersModel(modelUrl)
}

const predict = async (model, imageBuffer) => {
    const tensor = tfjs.node
    .decodeJpeg(imageBuffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()

    const predictions = await model.predict(tensor).data()
    return predictions
}

module.exports = { loadModel, predict }