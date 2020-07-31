let mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.mysqlUrl,
    port: process.env.mysqPort,
    user: process.env.mysqlUsername,
    password: process.env.mysqlPassword,
    database: process.env.mysqlDatabase,
    insecureAuth: true
});

const executeQuery = (query, res) => {
    connection.query(query, (error, results, fields) => {
        if(error) {
            res.json(error);
        } else {
            res.json(results);
        }
    });
}

const executeQueryWithValues = (query, values, res) => {
    connection.query(query, values, (error, results, fields) => {
        if(error) {
            res.json(error);
        } else {
            res.status(200).json(results);
        }
    });
}

module.exports.executeQuery = executeQuery;
module.exports.executeQueryWithValues = executeQueryWithValues;