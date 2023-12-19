const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/images')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname))
    }
})

const imageFileFilter = (req, file, callBack) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callBack(new Error(`You can't upload non-image files`), false)
    }
    callBack(null, true)
}

const upload = multer({ 
    storage, 
    fileFilter: imageFileFilter 
})

module.exports = upload