const db_serve = require('./socket_dbserver')

function handleSocketEvent(io) {
    //socket注册用户
    const users = {}

    io.on('connection', (socket) => {
        console.log('A user connected');

        //用户登录
        socket.on('login', (id) => {
            //回复客户端
            socket.emit('login', socket.id)
            // 存储注册用户 键值为 客户端 id   值为socket.id
            socket.name = id
            users[id] = socket.id
            console.log(socket.id + '进来');
        })

        //用户一对一消息发送
        socket.on('msg', async (msg, fromId, toId) => {
            console.log(msg, fromId, toId);
            try {
                let content = msg.messageType === 1 ? msg.content : msg.name
                //存储一对一消息 userId  friendId
                let messageId = await db_serve.saveMsg(content, toId, fromId, msg.messageType)
                //发送给对方
                if (users[toId]) {
                    //发送到聊天界面
                    socket.to(users[toId]).emit('msg', msg, fromId, toId, 0, messageId)
                    //发送到消息队列
                    socket.to(users[toId]).emit('msgHome', msg, fromId, 0)
                }
                //发送给自己
                // socket.emit('msg', msg, toId, 1)
                socket.emit('msgHome', msg, toId, 1)
            } catch (error) {
                console.error('发送消息时出错:', error);
            }
        })
        //加入群聊
        socket.on('Group', (roomId) => {
            console.log(roomId, '群', socket.id);
            socket.join(roomId)
        })
        //接收群消息
        socket.on('groupMsg', async (msg, fromId, gId) => {
            try {
                console.log(msg, fromId, gId);
                let content = msg.messageType === 1 ? msg.content : msg.name
                //存储群聊消息 userId  friendId
                let messageId = await db_serve.saveGroupMsg(content, fromId, gId, msg.messageType)
                //群内广播消息

                //聊天界面
                socket.to(gId).emit('groupMsg', msg, fromId, gId, messageId)
                //消息队列
                socket.to(gId).emit('groupMsgHome', msg, fromId, gId, 0)

                //通知自己
                socket.emit('groupMsgHome', msg, fromId, gId, 1)

            } catch (error) {
                console.error('发送消息时出错:', error);
            }
        })

        //用户离开
        socket.on('disconnect', () => {
            // 去掉socket注册用户
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
            }
            console.log(socket.id + '离开');
        });
    });
}

module.exports = handleSocketEvent;