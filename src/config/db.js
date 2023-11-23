var mysql = require('mysql2/promise')

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "EmailManager"
// })

// con.connect(function(err){
//     if(err) console.log("Loi connect!",err)
// })
var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "EmailManager",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    queueLimit: 0
})


module.exports= con