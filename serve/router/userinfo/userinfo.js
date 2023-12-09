const express = require('express')
const router = express.Router()
const userInfo_handler = require('../../router_handler/userinfo/userinfo_handler')

//获取userinfo
router.get('/getUserInfo', userInfo_handler.getUserInfo)

//修改userInfo
router.post('/notifyUserInfo', userInfo_handler.notifyUserInfo)

module.exports = router