let router = require('express').Router();
let dbaccess = require('../dao/dbaccess');
const { STATUS_CODES } = require('http');
let verifyJWT = require('./jwt').verifyJWT;
const vendaUrl = '/api/venda';

const insertQueryVenda = 'INSERT INTO venda (data_venda, valor_total, cliente_cpf) VALUES (?, ?, ?)';
const selectSingleVenda = 'SELECT id, data_venda as dataVenda, valor_total as valorTotal, cliente_cpf as cliente FROM venda WHERE id = ?';
const selectAllVendas = 'SELECT id, data_venda as dataVenda, valor_total as valorTotal, cliente_cpf as cliente FROM venda';
const updateVenda = 'UPDATE venda SET data_venda = ?, valor_total = ?, cliente_cpf = ? WHERE id = ?';

const insertQueryItem = 'INSERT INTO item (id_venda, quantidade, produto_codigo) VALUES (?, ?, ?)';
const selectItensByVenda= 'SELECT id_item as idItem, id_venda, quantidade, produto_codigo as produto FROM item WHERE id_venda = ?';
const selectItemById = 'SELECT * FROM item WHERE id_item = ?';
const deleteItemById = 'DELETE FROM item WHERE id_item = ?';
const updateItem = 'UPDATE item SET quantidade = ? WHERE id_item = ?';

const selectProdutoByCodigo = 'SELECT * FROM produto WHERE codigo = ?';

const selectClienteByCpf = 'SELECT * FROM cliente WHERE cpf = ?';
const updateClienteQuery = 'UPDATE cliente SET saldo = ? WHERE cpf = ?';

router.post(vendaUrl + '/novo', verifyJWT, async (req, res, next) => {
    let venda = [
        req.body.dataVenda.replace("Z", ""),  
		req.body.valorTotal,
		req.body.cliente.cpf
	];
	let cliente = [
		req.body.cliente.saldo,
		req.body.cliente.cpf
	];
	let returnPacket = await dbaccess.executeQueryWithReturn(insertQueryVenda, venda);
	for await(let item of req.body.itens) {
		insertItem = [
			returnPacket.insertId,
			item.quantidade,
			item.produto.codigo
		];
		let dummyVar = await dbaccess.executeQueryWithReturn(insertQueryItem, insertItem);
	}
	let dummyVar = await dbaccess.executeQueryWithReturn(updateClienteQuery, cliente);
	res.status(201).json('CREATED');
});

router.get(vendaUrl, verifyJWT, async (req, res, next) => {
	let vendas = await dbaccess.executeQueryWithReturn(selectAllVendas, null);
	for await (const venda of vendas) {
		venda.itens = await dbaccess.executeQueryWithReturn(selectItensByVenda, venda.id);
		venda.cliente = await dbaccess.executeQueryWithReturn(selectClienteByCpf, venda.cliente);
		venda.cliente = venda.cliente[0];
		for await (const item of venda.itens) {
			item.produto = await dbaccess.executeQueryWithReturn(selectProdutoByCodigo, item.produto);
			item.produto = item.produto[0];
		};
	};	
	res.json(await vendas);
});

router.get(vendaUrl + '/:id', verifyJWT, async (req, res, next) => {
	let venda = await dbaccess.executeQueryWithReturn(selectSingleVenda, req.params.id)
	if(venda.length === 1 && venda[0].id !== undefined) {
		venda = venda[0];
		venda.itens = await dbaccess.executeQueryWithReturn(selectItensByVenda, venda.id);
		venda.cliente = await dbaccess.executeQueryWithReturn(selectClienteByCpf, venda.cliente);
		venda.cliente = venda.cliente[0];
		for await (const item of venda.itens) {
			item.produto = await dbaccess.executeQueryWithReturn(selectProdutoByCodigo, item.produto);
			item.produto = item.produto[0];
		}
	}
	res.json(await venda);
});

router.put(vendaUrl + '/editar', verifyJWT, async (req, res, next) => {
    let venda = [
        req.body.dataVenda.replace("Z", ""),  
		req.body.valorTotal,
		req.body.cliente.cpf,
		req.body.id
	];
	let cliente = [
		req.body.cliente.saldo,
		req.body.cliente.cpf
	];
	let returnPacket = await dbaccess.executeQueryWithReturn(updateVenda, venda);
	let dummyVar;
	for await(let item of req.body.itens) {
		let insertItem;
		if(item.idItem !== null && item.idItem !== undefined) {
			insertItem = [
				item.quantidade,
				item.itemId,
			];
			dummyVar = await dbaccess.executeQueryWithReturn(updateItem, insertItem);
		} else {
			insertItem = [
				req.body.id,
				item.quantidade,
				item.produto.codigo
			];
			dummyVar = await dbaccess.executeQueryWithReturn(insertQueryItem, insertItem);
		}
	}
	dummyVar = await dbaccess.executeQueryWithReturn(updateClienteQuery, cliente);
	res.status(200).json('OK');
});

router.delete(vendaUrl + '/excluirItem/:idItem', verifyJWT, async(req, res, next) => {
	let item = await dbaccess.executeQueryWithReturn(selectItemById, req.params.idItem);
	if(item.length === 1 && item[0].id_item !== undefined) {
		dbaccess.executeQueryWithValues(deleteItemById, item[0].id_item, res);
	} else {
		res.status(404).json();
	}
});

module.exports = router;