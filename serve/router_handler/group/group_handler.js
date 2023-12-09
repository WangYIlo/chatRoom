const query = require('../../db/index')
const { v4: uuidv4 } = require('uuid');

//生成 前三个名字组合
function generateName(userInfo) {
    let groupName = ''
    for (let i = 0; i < 3; i++) {
        if (userInfo[i]) {
            groupName = groupName.concat(',', userInfo[i].nickname)
        }
    }
    groupName = groupName.slice(1)
    return groupName
}

//创建群聊
exports.createGroup = async (req, res) => {
    let userInfo = req.body
    const groupName = generateName(userInfo)
    //uuid作为id
    const group_id = uuidv4()
    // 建立群聊
    const createGroupSql = `insert into chatgroups (id,groupName) values (?,?)`
    const result = await query(createGroupSql, [group_id, groupName])
    const groupdata = {
        group_id,
        groupName
    }
    // 添加用户-群聊关系
    const userGroupSql = `insert into user_group (user_id, group_id, unreadCount, lastReadMessageId) values (?, ?, 0, NULL)`
    userInfo.forEach(async (user) => {
        const user_id = user.id
        await query(userGroupSql, [user_id, group_id])
    });
    res.status(200).send({
        code: 0,
        message: '创建完成',
        data: groupdata
    })
}

//获取群聊信息
exports.getGroup = async (req, res) => {
    const { id } = req.auth
    const sql = `SELECT b.*
    FROM chatroom.user_group AS a
    LEFT JOIN chatroom.chatgroups AS b
    ON a.group_id = b.id where a.user_id=?`

    const result = await query(sql, id)
    res.status(200).send({
        code: 0,
        data: result
    })
}