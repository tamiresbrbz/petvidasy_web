import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";

export default function Vendas() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cartão de Crédito");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        console.error("Erro ao buscar clientes:", err);
        setError("Erro ao carregar clientes.");
      });

    axios.get("http://localhost:8080/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos.");
      });
  }, []);

  const adicionarProduto = () => {
    const produto = products.find((p) => String(p.id) === selectedProduct);
    if (!produto || quantity <= 0) {
      setError("Selecione um produto válido e informe uma quantidade maior que zero.");
      return;
    }

    const novoItem = {
      productId: produto.id,
      quantity: parseInt(quantity),
      price: produto.price ?? 0
    };

    setItems([...items, novoItem]);
    setSelectedProduct("");
    setQuantity(1);
    setError("");
  };

  const removerItem = (index) => {
    const novaLista = [...items];
    novaLista.splice(index, 1);
    setItems(novaLista);
  };

  function mapearMetodoPagamento(metodo) {
    switch (metodo) {
      case "Cartão de Crédito":
        return "CREDIT_CARD";
      case "Cartão de Débito":
        return "DEBIT_CARD";
      case "Dinheiro":
        return "CASH";
      default:
        return "CASH";
    }
  }

  const totalBruto = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalComDesconto = totalBruto - parseFloat(discount || 0);

  const finalizarVenda = () => {
    if (!selectedCustomer || items.length === 0) {
      setError("Selecione um cliente e adicione ao menos um produto.");
      return;
    }

    const venda = {
      customerId: parseInt(selectedCustomer),
      discount: parseFloat(discount || 0),
      totalAmount: totalComDesconto,
      paymentMethod: mapearMetodoPagamento(paymentMethod),
      status: "COMPLETED",
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      })),
      observation
    };

    axios.post("http://localhost:8080/sales", venda)
      .then(() => {
        alert("Venda registrada com sucesso!");
        setSelectedCustomer("");
        setSelectedProduct("");
        setQuantity(1);
        setItems([]);
        setDiscount(0);
        setObservation("");
        setError("");
      })
      .catch((err) => {
        console.error("Erro ao registrar venda:", err);
        alert("Erro ao finalizar a venda.");
      });
  };

  return (
    <div className="form-container">
      <header>
        <h1>Cadastro de Venda</h1>
      </header>
      <Menu />

      <form onSubmit={(e) => e.preventDefault()}>
        <label>Cliente:</label>
        <select
          className="form-select"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Selecione um cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <label>Produto:</label>
        <select
          className="form-select"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <label>Quantidade:</label>
        <input
          className="form-control"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button type="button" className="btn btn-success mt-2" onClick={adicionarProduto}>
          Adicionar Produto
        </button>

        {items.length > 0 && (
          <>
            <h2 className="mt-4">Itens da Venda</h2>
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unitário</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <tr key={index}>
                      <td>{prod?.name || "Produto"}</td>
                      <td>{item.quantity}</td>
                      <td>R$ {item.price.toFixed(2)}</td>
                      <td>R$ {(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removerItem(index)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        <p>Total bruto: R$ {totalBruto.toFixed(2)}</p>

        <label>Desconto:</label>
        <input
          className="form-control"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <p>Total com desconto: R$ {totalComDesconto.toFixed(2)}</p>

        <label>Método de Pagamento:</label>
        <select
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Dinheiro">Dinheiro</option>
        </select>

        <label>Observação:</label>
        <textarea
          className="form-control"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        ></textarea>

        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={finalizarVenda}
        >
          Finalizar Venda
        </button>

        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
}
