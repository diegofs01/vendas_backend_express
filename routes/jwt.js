let router = require('express').Router();
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let dbaccess = require('../dao/dbaccess');

const selectSingleUser = 'SELECT * FROM user WHERE username = ?';
const insertQuery = 'INSERT INTO user (username, password, email, role) VALUES (?, ?, ?, ?)';

router.post('/jwt/createUser', async (req, res, next) => {
    let user = await dbaccess.executeQueryWithReturn(selectSingleUser, req.body.username);
    if(user.length !== 0) {
        res.status(400).json('Usuário já existente');
    } else {
        user = [
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.role
        ];
        const salt = await bcrypt.genSalt(10);
        user[1] = await bcrypt.hash(user[1], salt); //user[1] is the password
        dbaccess.executeQueryWithValues(insertQuery, user, res);
    }
});

router.post('/jwt/login', async (req, res, next) => {
    let user = await dbaccess.executeQueryWithReturn(selectSingleUser, req.body.username);
    if(user.length === 0) {
         return res.status(404).json("Usuário não encontrado");
    } else {
        user = user[0];
        await bcrypt.compare(req.body.password, user.password, (err, response) => {
            if(response) {
                const id = user.username;   
                let token = jwt.sign({id}, process.env.SECRET, {
                    expiresIn: 1800
                });
                let expirationDate = new Date(0);
                jwt.verify(token, process.env.SECRET, (err, decoded) => {
                    expirationDate.setUTCSeconds(decoded.exp);
                })
                res.json({auth: true, token: token, expirationDate: expirationDate});
            } else {
                res.status(400).json("Usuário ou Senha incorreta");
            }
        });
    }
});

router.post('/jwt/checkToken', async (req, res, next) => {
    let checkToken = JSON.stringify(req.body).replace(/[{}":]/g, "");
    jwt.verify(checkToken, process.env.SECRET, (err, decoded) => {
        let expDate = new Date(0);
        expDate.setUTCSeconds(decoded.exp);
        if(expDate.getTime() > Date.now()) {
            res.status(200).json('OK');
        } else {
            res.status(406).json('NOT ACCEPTABLE');
        }
    });
});

router.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
});

const verifyJWT = (req, res, next) => {
    let token = req.headers.authorization;

    if(token.startsWith("Bearer ")) {
        token = token.substring(7);
    }

    if(!token) return res.status(401).json({auth: false, message: 'No token provided.'});

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err) return res.status(500).json({auth: false, message: 'Failed to authenticate token.'});

        req.userId = decoded.id;
        next();
    });
}

module.exports.router = router;
module.exports.verifyJWT = verifyJWT;