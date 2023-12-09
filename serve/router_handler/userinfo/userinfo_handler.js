const query = require('../../db/index')
//获取基本信息
exports.getUserInfo = async (req, res) => {
    try {
        const { id } = req.auth
        const sql = `select * from user where id=?`
        const result = await query(sql, id)
        if (result.length !== 1) return res.status(201).send({
            code: 1,
            message: '获取用户信息失败'
        })
        res.status(200).send({
            code: 0,
            message: '获取用户基本信息成功',
            data: result[0]
        })
    } catch (error) {
        res.status(500).send('服务器错误')
    }
}

//修改基本信息
exports.notifyUserInfo = async (req, res) => {
    const { id } = req.auth
    const { nickname, avatar } = req.body
    const notifySql = `update user set nickname=? ,avatar=? where id=?`

    const result = await query(notifySql, [nickname, avatar, id])

    if (result.affectedRows !== 1) {
        throw new Error('修改失败，请稍后再试！');
    }

    res.status(200).send({ code: 0, message: '修改成功' })
}