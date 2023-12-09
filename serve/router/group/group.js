const express = require('express')
const router = express.Router()
const group_handler = require('../../router_handler/group/group_handler')

//创建群聊
router.post('/createGroup', group_handler.createGroup)
//获取群聊
router.get('/getGroup', group_handler.getGroup)


module.exports = router