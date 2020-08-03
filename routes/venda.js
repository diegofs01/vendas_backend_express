let router = require('express').Router();
let dbaccess = require('../dao/dbaccess');
const { STATUS_CODES } = require('http');
let verifyJWT = require('./jwt').verifyJWT;
const vendaUrl = '/api/venda';

//const insertQuery = 'INSERT INTO produto (codigo, nome, unidade, valor) VALUES (?, ?, ?, ?)';
const selectSingleVenda = 'SELECT id, data_venda, valor_total, cliente_cpf as cliente FROM venda WHERE id = ?';
const selectAllVendas = 'SELECT id, data_venda, valor_total, cliente_cpf as cliente FROM venda';
const selectItensByVenda= 'SELECT id_item, id_venda, quantidade, produto_codigo as produto FROM item WHERE id_venda = ?';
const selectProdutoByCodigo = 'SELECT * FROM produto WHERE codigo = ?';
const selectClienteByCpf = 'SELECT * FROM cliente WHERE cpf = ?';
const selectItemById = 'SELECT * FROM item WHERE id_item = ?';
const deleteItemById = 'DELETE FROM item WHERE id_item = ?';
//const updateQuery = 'UPDATE produto SET nome = ?, unidade = ?, valor = ? WHERE codigo = ?';

/*
	@Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
	private int id;
	
	private Timestamp dataVenda;
	
	@ManyToOne
	private Cliente cliente;
	
	@Transient
	private Set<Item> itens;
	
    private double valorTotal;
*/

/*router.post(vendaUrl + '/novo', verifyJWT, (req, res, next) => {
    console.log(venda);
    let venda = [
        req.body.dataVenda, 
        req.body.cliente.cpf, 
        req.body.valorTotal
    ];
    dbaccess.executeQueryWithValues(insertQuery, produto, res);
});*/

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

//para arrumar
/* router.put(vendaUrl + '/editar', verifyJWT, (req, res, next) => {
    let produto = [ 
        req.body.nome, 
        req.body.unidade, 
        req.body.valor,
        req.body.codigo
    ];
    dbaccess.executeQueryWithValues(updateQuery, produto, res);
}); */

/* @PutMapping(path="/editar") 
public @ResponseBody String updateVenda(@RequestBody Venda venda) { 
	vendaRepository.save(venda);
	return "Venda atualizado";
} */

router.delete(vendaUrl + '/excluirItem/:idItem', verifyJWT, async(req, res, next) => {
	let item = await dbaccess.executeQueryWithReturn(selectItemById, req.params.idItem);
	if(item.length === 1 && item[0].id_item !== undefined) {
		dbaccess.executeQueryWithValues(deleteItemById, item[0].id_item, res);
	} else {
		res.status(404).json();
	}
});

module.exports = router;

/*
    @PostMapping(path="/novo")
	public @ResponseBody String addVenda(@RequestBody Venda venda) {		
		vendaRepository.save(venda);
		
		for(Item i: venda.getItens()) {
			i.setIdVenda(venda.getId());
			itemRepository.save(i);
		}
		
		clienteRepository.save(venda.getCliente());
		
		return "Venda salvo com Sucesso";
	}
	

	

*/