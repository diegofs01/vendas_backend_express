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
    connection.query(query, (error, results) => {
        if(error) {
            res.json(error);
        } else {
            res.status(200).json(results);
        }
    });
}

const executeQueryWithValues = (query, values, res) => {
    connection.query(query, values, (error, results) => {
        if(error) {
            res.json(error);
        } else {
            res.status(200).json(results);
        }
    });
}

const executeQueryWithReturn = async (query, values) => {
    let promise = new Promise((resolve, reject) => {
        if(values === null) {
            connection.query(query, (error, results) => {
                if(error) reject(error);
                resolve(results);
            });
        } 
        if(values !== null && values !== undefined) {
            connection.query(query, values, (error, results) => {
                if(error) reject(error);
                resolve(results);
            });
        };
        if(values === undefined) {
            reject({error: 'undefined'});
        };
    });
    try {
        return await promise;
    } catch (e) {
        return e;
    }
    
}

module.exports.executeQuery = executeQuery;
module.exports.executeQueryWithValues = executeQueryWithValues;
module.exports.executeQueryWithReturn = executeQueryWithReturn;