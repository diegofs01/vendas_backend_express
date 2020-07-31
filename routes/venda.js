let router = require('express').Router();
let dbaccess = require('../dao/dbaccess');
let verifyJWT = require('./jwt').verifyJWT;
const vendaUrl = '/api/venda';
//const insertQuery = 'INSERT INTO produto (codigo, nome, unidade, valor) VALUES (?, ?, ?, ?)';
const selectAllVendas = 'SELECT id, data_venda, valor_total, cliente_cpf as cliente FROM venda';
const selectSingleVenda = 'SELECT * FROM venda WHERE id_venda = ?';
const selectClienteByCpf = 'SELECT * FROM cliente WHERE cpf = ?';
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
	console.log(await dbaccess.executeQueryWithReturn(selectAllVendas, null));
});

router.get(vendaUrl + '/:id', verifyJWT, (req, res, next) => {
    let venda = dbaccess.executeQueryWithReturn(selectSingleVenda, req.params.id, res);
});

/*router.put(produtoUrl + '/editar', verifyJWT, (req, res, next) => {
    let produto = [ 
        req.body.nome, 
        req.body.unidade, 
        req.body.valor,
        req.body.codigo
    ];
    dbaccess.executeQueryWithValues(updateQuery, produto, res);
});*/

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
	
	@GetMapping(path="/")
	public @ResponseBody Iterable<Venda> getVendas() {
		Iterable<Venda> vendas = vendaRepository.findAll();
		
		for(Venda v: vendas) {
			Set<Item> itens = new HashSet<Item>();
			for(Item i: itemRepository.findItemsByVenda(v.getId())) {
				itens.add(i);
			}
			v.setItens(itens);
		}	
		
		return vendas;
	}
	
	@GetMapping(path="/{id}")
	public @ResponseBody Optional<Venda> getVendaById(@PathVariable("id") int id) {
		Optional<Venda> venda = vendaRepository.findById(id);
		
		if(venda.isPresent()) {
			Set<Item> itens = new HashSet<Item>();
			for(Item i: itemRepository.findItemsByVenda(venda.get().getId())) {
				itens.add(i);
			}
			
			venda.get().setItens(itens);
		}
		
		return venda;
	}
	
	@PutMapping(path="/editar") 
	public @ResponseBody String updateVenda(@RequestBody Venda venda) { 
		vendaRepository.save(venda);
		return "Venda atualizado";
	}
	
	@DeleteMapping(path="/excluirItem/{idItem}")
	public @ResponseBody void excluirItem(@PathVariable("idItem") int idItem) {
		Optional<Item> item = itemRepository.findById(idItem);
		if(item.isPresent()) {
			itemRepository.delete(item.get());
		}
    }
*/