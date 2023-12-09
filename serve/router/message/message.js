const express = require('express')
const router = express.Router()
const message_handler = require('../../router_handler/message/message_handler')

//获取一对一 未读消息
// router.get('/notRead', message_handler.getNotReadMessage)

//获取一对一 已读消息
// router.get('/haveRead', message_handler.getHaveReadMessage)


// 读取单条消息
router.post('/readMessage', message_handler.readMessage)

//获取一对一 未读消息count
router.get('/notReadCount', message_handler.getNotReadCount)

//获取一对一 最近30条消息
router.get('/getRecentMessage', message_handler.getRecentMessages)

//获取一对一最后一条消息
router.get('/lastMessage', message_handler.getLastMessage)



//群聊 读取单条消息
router.post('/readGroupMessage', message_handler.readGroupMessage)

//获取群聊最后一条消息
router.get('/lastGroupMessage', message_handler.getGroupLastMessage)

//获取群聊 个人未读消息count
router.get('/groupNotReadCount', message_handler.getGroupNotReadCount)

//获取群聊 最近30条消息
router.get('/getGroupRecentMessage', message_handler.getRecentGroupMessages)



module.exports = router