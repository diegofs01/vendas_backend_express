let router = require('express').Router();
let dbaccess = require('../dao/dbaccess');
let verifyJWT = require('./jwt').verifyJWT;
const clienteUrl = '/cliente';
const insertQuery = 'INSERT INTO cliente (cpf, nome, data_nascimento, sexo, cep, logradouro, numero, complemento, bairro, cidade, uf, saldo, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const selectAllQuery = 'SELECT * FROM cliente';
const selectSingleQuery = 'SELECT * FROM cliente WHERE cpf = ?';
const updateQuery = 'UPDATE cliente SET nome = ?, data_nascimento = ?, sexo = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ?, saldo = ?, ativo = ? WHERE cpf = ?';
const setClientAtivo = 'UPDATE cliente SET ativo = ? WHERE cpf = ?';
const selectAtivoQuery = 'SELECT * FROM cliente WHERE ativo = 0x01';

router.post(clienteUrl + '/novo', verifyJWT, (req, res, next) => {
    let cliente = [
        req.body.cpf, 
        req.body.nome, 
        req.body.dataNascimento, 
        req.body.sexo, 
        req.body.cep,
        req.body.logradouro,
        req.body.numero,
        req.body.complemento,
        req.body.bairro,
        req.body.cidade,
        req.body.uf,
        req.body.saldo,
        req.body.ativo.toLowerCase() === 'true'
    ];
    dbaccess.executeQueryWithValues(insertQuery, cliente, res);
});

router.get(clienteUrl, verifyJWT, (req, res, next) => {
    dbaccess.executeQuery(selectAllQuery, res);
});

router.get(clienteUrl + '/:cpf', verifyJWT, (req, res, next) => {
    if(req.params.cpf === 'ativos')
        next('route');
    else
        dbaccess.executeQueryWithValues(selectSingleQuery, req.params.cpf, res);
});

router.put(clienteUrl + '/editar', verifyJWT, (req, res, next) => {
    let cliente = [
        req.body.nome, 
        req.body.dataNascimento, 
        req.body.sexo, 
        req.body.cep,
        req.body.logradouro,
        req.body.numero,
        req.body.complemento,
        req.body.bairro,
        req.body.cidade,
        req.body.uf,
        req.body.saldo,
        req.body.ativo.toLowerCase() === 'true',
        req.body.cpf
    ];
    dbaccess.executeQueryWithValues(updateQuery, cliente, res);
});

router.post(clienteUrl + '/desativar/:cpf', verifyJWT, (req, res, next) => {
    let data = [
        false,
        req.params.cpf
    ];
    dbaccess.executeQueryWithValues(setClientAtivo, data, res);
});

router.post(clienteUrl + '/ativar/:cpf', verifyJWT, (req, res, next) => {
    let data = [
        true,
        req.params.cpf
    ];
    dbaccess.executeQueryWithValues(setClientAtivo, data, res);
});

router.get(clienteUrl + '/ativos', verifyJWT, (req, res, next) => {
    dbaccess.executeQuery(selectAtivoQuery, res);
});

module.exports = router;