const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require ('cookie-parser')
const routes = require('./controller/routes')
const path = require('path')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cookieParser())
app.use('/public/images', express.static(path.join(__dirname, 'sign_letters')))

routes(app)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})