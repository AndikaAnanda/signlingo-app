let favoriteWords = []

const favorites_post = async (req, res) => {
    try {
        const { word } = req.body
        if (!word) {
            return res.status(400).json({
                message: "Word not exist"
            })
        }
        favoriteWords.push(word)
        return res.status(201).json({
            message: `Word ${word} added to favorites`
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const favorites_get = async (req, res) => {
    res.status(200).json({
        favorites: favoriteWords
    })
}

module.exports = { favorites_get, favorites_post }