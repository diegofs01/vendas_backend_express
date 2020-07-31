let router = require('express').Router();
let dbaccess = require('../dao/dbaccess');
let verifyJWT = require('./jwt').verifyJWT;
const produtoUrl = '/api/produto';
const insertQuery = 'INSERT INTO produto (codigo, nome, unidade, valor) VALUES (?, ?, ?, ?)';
const selectAllQuery = 'SELECT * FROM produto';
const selectSingleQuery = 'SELECT * FROM produto WHERE codigo = ?';
const updateQuery = 'UPDATE produto SET nome = ?, unidade = ?, valor = ? WHERE codigo = ?';

router.post(produtoUrl + '/novo', verifyJWT, (req, res, next) => {
    let produto = [
        req.body.codigo, 
        req.body.nome, 
        req.body.unidade, 
        req.body.valor
    ];
    dbaccess.executeQueryWithValues(insertQuery, produto, res);
});

router.get(produtoUrl, verifyJWT, (req, res, next) => {
    dbaccess.executeQuery(selectAllQuery, res);
});

router.get(produtoUrl + '/:codigo', verifyJWT, (req, res, next) => {
    dbaccess.executeQueryWithValues(selectSingleQuery, req.params.codigo, res);
});

router.put(produtoUrl + '/editar', verifyJWT, (req, res, next) => {
    let produto = [ 
        req.body.nome, 
        req.body.unidade, 
        req.body.valor,
        req.body.codigo
    ];
    dbaccess.executeQueryWithValues(updateQuery, produto, res);
});

module.exports = router;