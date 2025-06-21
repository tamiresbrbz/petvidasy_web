import { useEffect, useState } from "react";
import Menu from './Menu';
import axios from 'axios';

export default function TelaRelatorios() {
  const [relatorioServicos, setRelatorioServicos] = useState([]);
  const [relatorioAgendamentos, setRelatorioAgendamentos] = useState([]);
  const [relatorioVendas, setRelatorioVendas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const [novoProduto, setNovoProduto] = useState({
    name: '',
    description: '',
    barcode: '',
    cost: '',
    price: '',
    minStock: '',
    stock: '',
    categoryId: '',
    isActive: true
  });

  const handleProdutoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoProduto(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/products", {
        ...novoProduto,
        cost: parseFloat(novoProduto.cost),
        price: parseFloat(novoProduto.price),
        minStock: parseInt(novoProduto.minStock),
        stock: parseInt(novoProduto.stock),
        categoryId: parseInt(novoProduto.categoryId)
      });
      alert("✅ Produto cadastrado com sucesso!");
      setNovoProduto({
        name: '',
        description: '',
        barcode: '',
        cost: '',
        price: '',
        minStock: '',
        stock: '',
        categoryId: '',
        isActive: true
      });
    } catch (err) {
      alert("❌ Erro ao cadastrar produto.");
      console.error(err);
    }
  };

 useEffect(() => {
  async function carregarRelatorios() {
    try {
      const [servicosRes, agendamentosRes, vendasRes] = await Promise.all([
        axios.get("http://localhost:8080/service-types"),
        axios.get("http://localhost:8080/schedules"),
        axios.get("http://localhost:8080/sales")
      ]);

      setRelatorioServicos(servicosRes.data);
      setRelatorioAgendamentos(agendamentosRes.data);
      setRelatorioVendas(vendasRes.data);
    } catch (err) {
      setMensagem("❌ Erro ao carregar relatórios: " + err.message);
      console.error(err);
    }
  }

  carregarRelatorios();
}, []);


  return (
    <div>
      <header>
        <h1>Relatórios</h1>
      </header>

      <Menu />

      <main>
        {mensagem && (
          <p style={{ color: "red", fontWeight: "bold" }}>{mensagem}</p>
        )}

        <section>
          <h2>Relatório de Serviços</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
              </tr>
            </thead>
            <tbody>
              {relatorioServicos.map(servico => (
                <tr key={servico.id}>
                  <td>{servico.id}</td>
                  <td>{servico.name}</td>
                  <td>{servico.description}</td>
                  <td>R$ {servico.price?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <br />

        <section>
          <h2>Relatório de Agendamentos</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {relatorioAgendamentos.map(agendamento => (
                <tr key={agendamento.id}>
                  <td>{agendamento.id}</td>
                  <td>{agendamento.customerName}</td>
                  <td>{agendamento.serviceName}</td>
                  <td>{new Date(agendamento.timestamp).toLocaleString()}</td>
                  <td>{agendamento.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <br />

        <section>
          <h2>Relatório de Vendas</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Total</th>
                <th>Status</th>
                <th>Método de Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {relatorioVendas.map(venda => (
                <tr key={venda.id}>
                  <td>{venda.id}</td>
                  <td>{venda.customerName}</td>
                  <td>{new Date(venda.timestamp).toLocaleString()}</td>
                  <td>R$ {venda.totalAmount?.toFixed(2)}</td>
                  <td>{venda.status}</td>
                  <td>{venda.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
