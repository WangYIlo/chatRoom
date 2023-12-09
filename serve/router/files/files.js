// 引入multer
const multer = require('multer')
const path = require('path')
//控制文件存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let { url } = req.body
        console.log(req.body);
        cb(null, path.join(__dirname, `../../data/${url}`))
    },
    filename: function (req, file, cb) {
        let { name } = req.body
        //文件名后缀
        let type = file.originalname.replace(/.+\./, '.')
        console.log(name);
        cb(null, name + type)
    }
})

const upload = multer({ storage: storage })


const express = require('express')
const router = express.Router()
const files_handler = require('../../router_handler/files/files_handler')

router.post('/upload', upload.single('image'), files_handler.handleFilesUpload)

router.post('/writeMoment', upload.single('image'), files_handler.writeMoments)


module.exports = router