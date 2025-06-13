import { useState } from "react";
import axios from "axios";
import Menu from "./Menu";

export default function CadastroServicosProdutos() {
  const [serviceType, setServiceType] = useState({
    name: "",
    basePrice: "",
    duration: "",
    description: "",
    isActive: true,
  });

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    barcode: "",
    isActive: true,
    categoryId: "", // Ajuste conforme o backend
  });

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceType({ ...serviceType, [name]: value });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const cadastrarTipoServico = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/service-types", {
        ...serviceType,
        basePrice: parseFloat(serviceType.basePrice),
        duration: parseInt(serviceType.duration),
      });
      alert("Tipo de serviço cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar tipo de serviço:", error);
      alert("Erro ao cadastrar tipo de serviço.");
    }
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/products", {
        ...product,
        price: parseFloat(product.price),
        cost: parseFloat(product.cost),
        stock: parseInt(product.stock),
        minStock: parseInt(product.minStock),
      });
      alert("Produto cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    }
  };

  return (
    <div>
        <header>
            <h1>Cadastro de Serviços e Produtos</h1>
            <p>Utilize os formulários abaixo para cadastrar novos tipos de serviços ou produtos.</p>
            <Menu />
        </header>
      
      <form onSubmit={cadastrarTipoServico}>
        <h2>Cadastro de Tipo de Serviço</h2>
        <input name="name" placeholder="Nome" onChange={handleServiceChange} required />
        <input name="basePrice" placeholder="Preço base" type="number" onChange={handleServiceChange} required />
        <input name="duration" placeholder="Duração (min)" type="number" onChange={handleServiceChange} required />
        <input name="description" placeholder="Descrição" onChange={handleServiceChange} required />
        <label>
          Ativo?
          <input type="checkbox" checked={serviceType.isActive} onChange={(e) => setServiceType({ ...serviceType, isActive: e.target.checked })} />
        </label>
        <button type="submit">Cadastrar Tipo de Serviço</button>
      </form>

      <hr />

      
      <form onSubmit={cadastrarProduto}>
        <h2>Cadastro de Produto</h2>
        <input name="name" placeholder="Nome" onChange={handleProductChange} required />
        <input name="price" placeholder="Preço" type="number" onChange={handleProductChange} required />
        <input name="cost" placeholder="Custo" type="number" onChange={handleProductChange} required />
        <input name="stock" placeholder="Estoque" type="number" onChange={handleProductChange} required />
        <input name="minStock" placeholder="Estoque mínimo" type="number" onChange={handleProductChange} required />
        <input name="categoryId" placeholder="ID da categoria" type="number" onChange={handleProductChange} required />
        <label>
          Ativo?
          <input type="checkbox" checked={product.isActive} onChange={(e) => setProduct({ ...product, isActive: e.target.checked })} />
        </label>
        <button type="submit">Cadastrar Produto</button>
      </form>
    </div>
  );
}
