let router = require('express').Router();
let clienteDao = require('../dao/clienteDao');
let jwt = require('./jwt').verifyJWT;

router.get('/cliente', jwt, (req, res, next) => {
    //res.json([{id:1, nome:'Diego'}, {id:2, nome:'Peralta'}]);
    clienteDao.execQuery('SELECT * FROM cliente', res);
});

router.get('/cliente/:id', jwt, (req, res, next) => {
    clienteDao.execQuery('SELECT * FROM cliente WHERE cpf=' + req.params.id, res);
})

module.exports = router;