const express = require('express')
const router = express.Router()
const friend_handler = require('../../router_handler/friend/friend_handler')

//查找好友
router.post('/findFriend', friend_handler.findFriend)
// 添加|同意 好友
router.post('/addFriends', friend_handler.addFriends)
// 拒绝添加
router.post('/refuseFriedns', friend_handler.refuseFriends)
//申请好友
router.post('/requestFriends', friend_handler.requestFriends)
//获取好友
router.get('/getFriend', friend_handler.getFriend)
// 获取申请好友列表
router.get('/getRequestFriends', friend_handler.getRequestFriends)



module.exports = router