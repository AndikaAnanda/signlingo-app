const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require ('cookie-parser')
const routes = require('./controller/routes')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cookieParser())

routes(app)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})