const { Storage } = require('@google-cloud/storage')
const textToSpeech = require('@google-cloud/text-to-speech')

const storage = new Storage()
const ttsClient = new textToSpeech.TextToSpeechClient()
const bucketName = 'signlingo-speech'
const fileName = `speech_${Date.now()}.wav`
const storageUri = `gs://${bucketName}/${fileName}`

const generateSpeech_post = async (req, res) => {
    const { text } = req.body
    try {
        const [response] = await ttsClient.synthesizeSpeech({
            input: {
                text: text
            },
            voice: {
                languageCode: 'id-ID',
                ssmlGender: 'FEMALE'
            },
            audioConfig: {
                audioEncoding: 'LINEAR16'
            }
        })
        await storage.bucket(bucketName).file(fileName).save(response.audioContent)
        res.status(201).json({
            message: `Successfully generate ${fileName} to ${storageUri}`
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = generateSpeech_post