const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

routes(app)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})