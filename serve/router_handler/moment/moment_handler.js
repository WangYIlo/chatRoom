const query = require('../../db/index')
const dbserverSql = require('../../db/dbserver')

//获取动态
exports.getMoments = async (req, res) => {
    let { id, avatar, nickname } = req.auth
    const friends = await dbserverSql.getFriend(id)
    // 提取好友的 id 列表
    const friendIds = friends.map(friend => friend.id);
    //获取好友动态
    const FriendsMoments = await dbserverSql.getFriendMoments(friendIds);
    //获取自己动态
    const myMoments = await dbserverSql.getMyMoments(id)
    let moments = [...FriendsMoments, ...myMoments]
    moments = moments.map(moment => {
        if (moment.user_id === id) {
            // 当前用户的动态，使用自己的头像
            return { ...moment, avatar, nickname };
        } else {
            // 好友的动态，查找对应的好友头像
            const friend = friends.find(f => f.id === moment.user_id);
            return { ...moment, avatar: friend.avatar, nickname: friend.nickname };
        }
    })
    res.send({
        code: 0,
        moments
    })
}