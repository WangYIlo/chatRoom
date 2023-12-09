const query = require('../../db/index')
const bcrypt = require('bcryptjs')
const config = require('../../config')
const jwt = require('jsonwebtoken')


//reqister
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body
        //检查用户名是否存在
        const sql = `select * from user where username=?`
        const repeat = await query(sql, username)
        if (repeat.length > 0) {
            return res.status(201).send({ code: 1, message: '用户名已存在, 请重新注册!' });
        }
        const hashPassword = await bcrypt.hash(password, 10)
        //插入数据库
        const insertSql = `insert into user set ?`
        const result = await query(insertSql, { username, password: hashPassword, nickname: username })
        if (result.affectedRows !== 1) {
            throw new Error('注册失败，请稍后再试！');
        }
        res.status(200).send({ code: 0, message: '注册成功' })
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }

}
//login
exports.login = async (req, res) => {
    const { username, password } = req.body
    //检查用户名和密码是否正确
    try {
        const sql = `select * from user where username=? `
        const result = await query(sql, username)
        if (result.length !== 1) {
            return res.status(201).send({
                code: 1,
                message: '用户不存在'
            })
        }
        const compareResult = await bcrypt.compare(password, result[0].password)
        if (!compareResult) {
            return res.status(201).send({
                code: 1,
                message: '密码或用户名错误'
            })
        }
        //生成JWT返回
        const user = { ...result[0], password: '' }
        const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: '24h' })
        res.status(200).send({
            message: '登录成功',
            code: 0,
            token: 'Bearer ' + token,
            html: `<html></html>`
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('服务器错误')
    }
}