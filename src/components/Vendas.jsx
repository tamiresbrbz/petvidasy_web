// Tela de Vendas atualizada com desconto, remoção de itens e melhoria nos controles
import { useState, useEffect } from "react";
import Menu from './Menu';

export default function TelaVendas() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [observacao, setObservacao] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("CREDIT_CARD");
  const [desconto, setDesconto] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const clientesRes = await fetch("http://localhost:8080/customers");
        const produtosRes = await fetch("http://localhost:8080/products");
        if (!clientesRes.ok || !produtosRes.ok) throw new Error("Erro ao carregar dados");

        const clientesData = await clientesRes.json();
        const produtosData = await produtosRes.json();
        setClientes(clientesData);
        setProdutos(produtosData);
      } catch (e) {
        setMensagem("❌ Erro ao carregar dados. Verifique o servidor.");
      }
    };
    carregarDados();
  }, []);

  useEffect(() => {
    const totalBruto = itens.reduce((soma, item) => soma + item.subtotal, 0);
    const totalComDesconto = totalBruto - parseFloat(desconto || 0);
    setTotal(totalComDesconto >= 0 ? totalComDesconto : 0);
  }, [itens, desconto]);

  const adicionarProduto = () => {
    const produto = produtos.find((p) => p.id === parseInt(produtoId));
    if (!produto || quantidade < 1) return;

    const existente = itens.find(item => item.produtoId === produto.id);
    if (existente) {
      const novosItens = itens.map(item =>
        item.produtoId === produto.id
          ? { ...item, quantidade: item.quantidade + quantidade, subtotal: (item.quantidade + quantidade) * item.unitPrice }
          : item
      );
      setItens(novosItens);
    } else {
      const subtotal = produto.price * quantidade;
      setItens(prev => [...prev, {
        produtoId: produto.id,
        quantidade,
        unitPrice: produto.price,
        subtotal,
        nome: produto.name
      }]);
    }
    setQuantidade(1);
    setProdutoId("");
  };

  const removerItem = (produtoId) => {
    setItens(prev => prev.filter(item => item.produtoId !== produtoId));
  };

  const finalizarVenda = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!itens.length) {
      setMensagem("❌ Adicione ao menos um item à venda.");
      return;
    }

    const venda = {
      timestamp: new Date().toISOString(),
      totalAmount: total,
      discount: parseFloat(desconto || 0),
      paymentMethod: metodoPagamento,
      status: "COMPLETED",
      customerId: parseInt(clienteId),
      employeeId: 1, // deve vir do usuário logado idealmente
      observacao,
    };

    try {
      const vendaRes = await fetch("http://localhost:8080/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });

      if (!vendaRes.ok) throw new Error("Erro ao registrar venda.");
      const vendaCriada = await vendaRes.json();

      for (const item of itens) {
        const saleItem = {
          quantity: item.quantidade,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          saleId: vendaCriada.id,
          productId: item.produtoId
        };

        const itemRes = await fetch("http://localhost:8080/sale-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleItem),
        });

        if (!itemRes.ok) throw new Error("Erro ao registrar item da venda.");
      }

      setMensagem("✅ Venda registrada com sucesso!");
      setItens([]);
      setClienteId("");
      setProdutoId("");
      setQuantidade(1);
      setTotal(0);
      setObservacao("");
      setDesconto(0);
    } catch (err) {
      setMensagem("❌ " + err.message);
    }
  };

  return (
    <div>
      <header>
        <h1>Registro de Vendas</h1>
      </header>
      <Menu />
      <main>
        <section>
          <h2>Dados da Venda</h2>

          <label>Cliente:</label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select><br /><br />

          <label>Produto:</label>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
            ))}
          </select>

          <label> Quantidade: </label>
          <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value))} />

          <button type="button" onClick={adicionarProduto}>Adicionar Produto</button>
        </section>

        <section>
          <h2>Itens da Venda</h2>
          <ul>
            {itens.map((item, idx) => (
              <li key={idx}>
                {item.quantidade}x {item.nome} - R$ {item.subtotal.toFixed(2)}
                <button onClick={() => removerItem(item.produtoId)}>Remover</button>
              </li>
            ))}
          </ul>

          <p>Total bruto: R$ {itens.reduce((soma, i) => soma + i.subtotal, 0).toFixed(2)}</p>

          <label>Desconto:</label>
          <input type="number" min="0" value={desconto} onChange={(e) => setDesconto(e.target.value)} />

          <p><strong>Total com desconto: R$ {total.toFixed(2)}</strong></p>

          <label>Método de Pagamento:</label>
          <select value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)}>
            <option value="CREDIT_CARD">Cartão de Crédito</option>
            <option value="DEBIT_CARD">Cartão de Débito</option>
            <option value="PIX">PIX</option>
            <option value="CASH">Dinheiro</option>
          </select><br /><br />

          <label>Observação:</label><br />
          <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows="4" cols="50"></textarea><br /><br />

          <button onClick={finalizarVenda}>Finalizar Venda</button>
          {mensagem && <p style={{ color: mensagem.startsWith("✅") ? "green" : "red", fontWeight: 'bold' }}>{mensagem}</p>}
        </section>
      </main>
    </div>
  );
}
