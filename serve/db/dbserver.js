const query = require('../db/index')


//发表动态
exports.writeMoment = async (text, user_id, image) => {
    try {
        let moment_Sql
        let momentResult
        if (image) {
            moment_Sql = `insert into moment (text,image) values (?,?)`
            momentResult = await query(moment_Sql, [text, image])
        } else {
            moment_Sql = `insert into moment (text) values (?)`
            momentResult = await query(moment_Sql, [text])
        }
        const user_Moment_Sql = `insert into user_moments (user_id,moment_id) values (?,?)`
        let momentId = momentResult.insertId
        const result = await query(user_Moment_Sql, [user_id, momentId])
        if (result.affectedRows !== 1) {
            throw new Error('发表失败')
        }
        return '发表成功'
    } catch (error) {
        console.error('服务器错误', error);
        throw new Error(error.message)
    }

}
//获取好友动态
exports.getFriendMoments = async (friendIds) => {
    const sql = `
    SELECT m.*,um.user_id
    FROM moment m
    left JOIN user_moments um ON m.id = um.moment_id
    WHERE um.user_id IN (${friendIds.map(f => f).join(',')})
  `;
    let moments = await query(sql, friendIds)

    console.log(moments);

    return moments
}
//获取自己动态
exports.getMyMoments = async (id) => {
    const sql = `
    SELECT m.*,um.user_id
    FROM moment m
    left JOIN user_moments um ON m.id = um.moment_id
    WHERE um.user_id = ?
  `;

    let moments = await query(sql, id)

    return moments
}

//获取好友列表
exports.getFriend = async (id) => {
    const select = `SELECT u.username,u.id,u.avatar,u.nickname,f.create_Time,f.updated_time
    FROM friend f 
    left join  user u ON u.id = f.friend_id
    WHERE f.user_id = ?`
    const selectFriend = await query(select, id)

    return selectFriend
}
