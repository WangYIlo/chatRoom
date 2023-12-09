const query = require('../db/index')

//存储一对一消息
exports.saveMsg = async (content, userId, friendId, messageType) => {
    try {
        const sql = `INSERT INTO firend_message (content, userId, friendId,type,messageType) VALUES (?, ?, ?,?,?)`;
        let result = await query(sql, [content, userId, friendId, 0, messageType])
        console.log('消息已存储到数据库');
        return result.insertId;
    } catch (error) {
        console.error('存储消息时出错:', error);
        throw new Error(error.message)
    }
}

//存储群聊消息
exports.saveGroupMsg = async (content, userId, gId, messageType) => {
    try {
        console.log(content, '11111111');
        const sql = `INSERT INTO group_message (content, userId, groupId,type,messageType) VALUES (?, ?, ?,?,?)`;
        let result = await query(sql, [content, userId, gId, 0, messageType])
        console.log('消息已存储到数据库');
        // 更新user_group表中其他成员的unreadCount和lastMessageId
        const updateUnreadCountSql = `UPDATE user_group SET unreadCount = unreadCount + 1 WHERE group_id = ? AND user_id != ?`;
        await query(updateUnreadCountSql, [gId, userId]);
        return result.insertId;
    } catch (error) {
        console.error('存储消息时出错:', error);
        throw new Error(error.message)
    }
}