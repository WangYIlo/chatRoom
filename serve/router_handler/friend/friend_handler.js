const query = require('../../db/index')
const dbserverSql = require('../../db/dbserver')

//addFriends 添加|同意 好友
exports.addFriends = async (req, res) => {

    try {
        const { id: userId } = req.auth
        const { id: friendId } = req.body
        //删除好友申请表中的数据
        const deleteRequestSql = `DELETE FROM friend_request WHERE (request_id = ? AND friend_id = ?) or (request_id = ? AND friend_id = ?) `
        const deleteResult = await query(deleteRequestSql, [userId, friendId, friendId, userId])
        if (!deleteResult.affectedRows === 2 || !deleteResult.affectedRows === 1) {
            throw new Error('操作失败，请稍后再试！');
        }
        //添加好友
        const addFriendSql = `INSERT INTO friend (user_id, friend_id) VALUES (?, ?)`
        const result = await query(addFriendSql, [userId, friendId])
        await query(addFriendSql, [friendId, userId])
        if (result.affectedRows !== 1) {
            throw new Error('添加失败，请稍后再试！');
        }
        res.status(200).send({ code: 0, message: '添加成功' })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('服务器错误')
    }
}
//refuseFriends 拒绝好友申请
exports.refuseFriends = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId } = req.body
    // 拒绝
    const refuseFriendSql = `DELETE FROM friend_request WHERE request_id = ? AND friend_id = ?`
    const result = await query(refuseFriendSql, [userId, friendId])
    if (result.affectedRows !== 1) {
        throw new Error('拒绝失败，请稍后再试！');
    }
    res.status(200).send({ code: 0, message: '拒绝成功' })

}
// requestFriends 申请好友
exports.requestFriends = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId } = req.body
    // 检查用户是否存在
    const findfriendSql = `SELECT * FROM user WHERE id = ?`
    const select = await query(findfriendSql, friendId)
    if (select.length === 0) {
        return res.status(201).send({
            code: 1,
            message: '用户不存在'
        })
    }
    // 检查是否已经是好友
    const alreadyFriendSql = `SELECT * FROM friend WHERE user_id = ? AND friend_id = ?`
    const alreadyFriend = await query(alreadyFriendSql, [userId, friendId])
    if (alreadyFriend.length > 0) {
        return res.status(201).send({
            code: 1,
            message: '已经是好友了'
        })
    }
    // 检查是否是重复申请
    const repeatedlyRequestSql = `SELECT * FROM friend_request WHERE request_id = ? AND friend_id = ?`
    const repeatedRes = await query(repeatedlyRequestSql, [userId, friendId])
    if (repeatedRes.length > 0) {
        return res.status(201).send({
            code: 1,
            message: '请耐心等待,切勿重复申请'
        })
    }
    // 发出申请
    const addFriendSql = `INSERT INTO friend_request (request_id, friend_id) VALUES (?, ?)`
    const result = await query(addFriendSql, [userId, friendId])
    if (result.affectedRows !== 1) {
        throw new Error('添加失败，请稍后再试！');
    }
    res.status(200).send({ code: 0, message: '申请成功' })

}
// getRequestFriends 获取申请好友列表
exports.getRequestFriends = async (req, res) => {
    const { id } = req.auth
    const getRequestFriendsSql = `SELECT * from friend_request where friend_id=?`
    let result = await query(getRequestFriendsSql, id)
    if (result.length === 0) {
        return res.status(200).send({ code: 1, message: '暂无好友申请' })
    }
    const friendIds = result.map((friendRequest) => friendRequest.request_id);
    const getUsersSql = `SELECT * FROM user WHERE id IN (?)`;
    const users = await query(getUsersSql, [friendIds]);
    const data = users.map((user) => {
        const userData = { ...user }
        delete userData.password
        return userData
    })
    res.status(200).send({ code: 0, data })
}



//findFriend 查找好友
exports.findFriend = (req, res) => {
    res.send('ok')
}
//getFirend  获取好友列表
exports.getFriend = async (req, res) => {
    const { id } = req.auth
    const selectFriend = await dbserverSql.getFriend(id)
    res.send({
        code: 0,
        data: selectFriend
    })

}
