const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'Your db password',
    database: 'db name'
})

connection.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database is connected");
    }
})


module.exports = connection;
