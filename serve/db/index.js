const mysql = require('mysql')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'chatroom',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci'
})

db.connect()


function query(sql, values) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = query
