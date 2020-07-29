let mysql = require('mysql');

const execQuery = (query, res) => {
    const connection = mysql.createConnection({
        host: process.env.mysqlUrl,
        port: process.env.mysqPort,
        user: process.env.mysqlUsername,
        password: process.env.mysqlPassword,
        database: process.env.mysqlDatabase,
        insecureAuth: true
    });

    connection.query(query, (error, results, fields) => {
        if(error) 
            res.json(error);
        else
            res.json(results);
        connection.end();
    });
}

module.exports.execQuery = execQuery;