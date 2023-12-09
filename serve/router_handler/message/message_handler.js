const query = require('../../db/index')

//获取一对一 30条未读消息 并且将他们转为已读 
exports.getNotReadMessage = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId } = req.query
    const notReadSql = `SELECT * FROM firend_message WHERE userId=? AND friendId=? AND type=0 ORDER BY time ASC LIMIT 30`
    const updateSql = `UPDATE firend_message SET type=1 WHERE id=?`
    // 获取30条未读消息
    const result = await query(notReadSql, [userId, friendId])
    // 标记这30条消息为已读
    for (const message of result) {
        await query(updateSql, [message.id])
    }
    if (result.length === 0) {
        return res.status(200).send({ code: 0, noMore: true })
    }
    res.status(200).send({ code: 0, result })
}
//获取一对一 30条已读消息 
exports.getHaveReadMessage = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId, page } = req.query
    const pageSize = 30 // 每页消息数量
    const offset = (page - 1) * pageSize // 计算偏移量
    console.log(friendId);
    notReadSql = `select * from firend_message where userId=? and friendId=? and type=1 ORDER BY time ASC LIMIT ? OFFSET ?`
    const result = await query(notReadSql, [userId, friendId, pageSize, offset])
    res.status(200).send({ code: 0, result })
}


//一对一 读取即时单条消息
exports.readMessage = async (req, res) => {
    const { id: userId } = req.auth
    const { id: messageId } = req.body
    const sql = `update firend_message set type=1 where userId=? and id=?`
    let result = await query(sql, [userId, messageId])
    res.status(200).send({ code: 0, message: '读取成功' })
}
//获取一对一 未读消息count
exports.getNotReadCount = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId } = req.query
    console.log(userId, friendId, 'count');
    notReadCountSql = `SELECT COUNT(*) AS count from firend_message where userId=? and friendId=? and type=0`
    const result = await query(notReadCountSql, [userId, friendId])

    res.status(200).send({ code: 0, count: result[0].count })
}
//获取一对一最后一条消息
exports.getLastMessage = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId } = req.query
    lastMessageSql = `SELECT *
    FROM firend_message
    WHERE (userId=? AND friendId=?) 
    OR (userId=? AND friendId=?) 
    ORDER BY time DESC
    LIMIT 1`
    const result = await query(lastMessageSql, [userId, friendId, friendId, userId])
    res.status(200).send({ code: 0, lastMessage: result[0] })
}
// 获取一对一最近的聊天记录,并将未读转为已读
exports.getRecentMessages = async (req, res) => {
    const { id: userId } = req.auth
    const { id: friendId, page } = req.query

    console.log(friendId, userId);

    const pageSize = 30 // 每页消息数量
    const offset = (page - 1) * pageSize // 计算偏移量

    // 获取最近的30条消息（包括未读和已读）
    const sql =
        `SELECT * FROM firend_message
         WHERE (userId=? AND friendId=?) 
        OR (userId=? AND friendId=?) 
        ORDER BY time DESC LIMIT ? OFFSET ? `
    const messages = await query(sql, [userId, friendId, friendId, userId, pageSize, offset])
    // 升序
    messages.sort((a, b) => a.time - b.time);
    // 将用户 未读消息标记为已读
    const unreadMessages = messages.filter(message => message.type === 0 && message.userId === userId)
    if (unreadMessages.length > 0) {
        const updateSql = `
        UPDATE firend_message 
        SET type=1 
        WHERE id IN (${unreadMessages.map(message => message.id).join(',')})
      `
        await query(updateSql)
    }

    res.status(200).send({ code: 0, messages })
}

//群聊 读取即时单条消息
exports.readGroupMessage = async (req, res) => {
    const { id: userId } = req.auth
    const { id: messageId, gId } = req.body
    const updateSql = `UPDATE user_group SET lastReadMessageId = ?, unreadCount = 0 WHERE group_id = ? AND user_id = ?`;
    let result = await query(updateSql, [messageId, gId, userId])
    res.status(200).send({ code: 0, message: '读取成功' })
}
//获取群聊最后一条消息
exports.getGroupLastMessage = async (req, res) => {
    const { id: gId } = req.query
    let lastMessageSql = `SELECT *
    FROM group_message
    WHERE  groupId=?
    ORDER BY time DESC
    LIMIT 1`
    const result = await query(lastMessageSql, gId)
    res.status(200).send({ code: 0, lastMessage: result[0] })
}
//获取群聊 个人未读消息count
exports.getGroupNotReadCount = async (req, res) => {
    const { id: userId } = req.auth
    const { id: gId } = req.query
    let unreadCountSql = `SELECT unreadCount from user_group where user_id=? and group_id=?`
    const result = await query(unreadCountSql, [userId, gId])
    res.status(200).send({ code: 0, unreadCount: result[0].unreadCount })
}
// 获取群聊最近的聊天记录，并更新 个人的未读信息
exports.getRecentGroupMessages = async (req, res) => {
    const { id: userId } = req.auth
    const { id: gId, page } = req.query
    const pageNumber = parseInt(page)

    const pageSize = 30 // 每页消息数量
    const offset = (page - 1) * pageSize // 计算偏移量

    // 获取最近的30条消息
    const sql =
        `SELECT group_message.*, user.avatar 
        FROM group_message 
        JOIN user ON group_message.userId = user.id 
        WHERE group_message.groupId = ? 
        ORDER BY group_message.time DESC 
        LIMIT ? OFFSET ?`

    const messages = await query(sql, [gId, pageSize, offset])
    // 升序
    messages.sort((a, b) => a.time - b.time);
    // 如果page不存在，则更新user_group表中的lastReadMessage和unreadCount字段
    if (pageNumber === 1 && messages.length > 0) {
        const updateSql = `UPDATE user_group SET lastReadMessageId = ?, unreadCount = 0 WHERE group_id = ? AND user_id = ?`;
        await query(updateSql, [messages[messages.length - 1].id, gId, userId]);
    }


    res.status(200).send({ code: 0, messages })
}

