const dbserverSql = require('../../db/dbserver')

//处理聊天图片上传
exports.handleFilesUpload = (req, res) => {
    let name = req.file.filename
    console.log(req.file);
    let { fromId, toId, sendTime, messageType, url, avatar } = req.body
    res.status(200).send({
        code: 0,
        data: {
            name,
            fromId,
            toId,
            sendTime,
            messageType,
            url: url,
            avatar
        }
    })
}

// 发表动态
exports.writeMoments = async (req, res) => {
    let name = req.file?.filename
    let { text } = req.body
    let { id } = req.auth

    let message = await dbserverSql.writeMoment(text, id, name)

    res.status(200).send({
        code: 0,
        message
    })
}