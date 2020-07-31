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
            res.status(200).json(results);
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

const executeQueryWithReturn = async (query, values) => {
    if(values === null) {
        connection.query(query, async (error, results) => {
            if(error === null) {
                return results;
            }
        });
    } else {
        connection.query(query, values, async (error, results) => {
            if(error === null) {
                return results;
            }
        });
    }
    return [];
}

module.exports.executeQuery = executeQuery;
module.exports.executeQueryWithValues = executeQueryWithValues;
module.exports.executeQueryWithReturn = executeQueryWithReturn;