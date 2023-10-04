const mysql = require('mysql2')

module.exports.connection = mysql.createConnection({
    host: '192.168.10.212',
    user: 'a.dominici',
    password: 'D0m1nici!$',
    database: 'WS_WhatsApp',
})

