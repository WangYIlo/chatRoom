const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const path = require('path')
//导入body-parser中间件
const bodyParser = require('body-parser')
//解析token中间件
var { expressjwt: jwt } = require("express-jwt");
const config = require('./config')
const handleSocketEvent = require('./socket/socket')

const app = express()
const server = createServer(app)

// 路由配置
const userRouter = require('./router/user/user')
const friendRouter = require('./router/friend/friend')
const userInfoRouter = require('./router/userinfo/userinfo')
const groupRouter = require('./router/group/group')
const filesRouter = require('./router/files/files')
const messageRouter = require('./router/message/message')
const momentRouter = require('./router/moment/moment')
// 配置cors 处理跨域
app.use(cors())

//解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//解析 application/json
app.use(express.json());

//静态托管--静态缓存
app.use('/data', express.static('data', {
    maxAge: 31536000  // 设置缓存的最大时间，单位为毫秒
}));



app.use(
    jwt({
        secret: config.jwtSecretKey,
        algorithms: ["HS256"],
    }).unless({ path: [/^\/api\//, /^\/data\//] })
);

app.use('/api', userRouter)
app.use('/files', filesRouter)
app.use('/message', messageRouter)
app.use('/my', friendRouter, userInfoRouter, groupRouter, momentRouter)

//socket事件处理
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
handleSocketEvent(io)

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});