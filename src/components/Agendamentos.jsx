import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";

export default function Agendamentos() {
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/customers")
      .then((res) => {
        const lista = res.data._embedded?.customResourceList || [];
        setCustomers(lista.map(item => item.content || item));
      })
      .catch((err) => console.error("Erro ao buscar clientes:", err));

    axios.get("http://localhost:8080/api/pets")
      .then((res) => {
        const lista = res.data._embedded?.customResourceList || [];
        setPets(lista.map(item => item.content || item));
      })
      .catch((err) => console.error("Erro ao buscar pets:", err));

    axios.get("http://localhost:8080/api/employees")
      .then((res) => {
        const lista = res.data._embedded?.customResourceList || [];
        setEmployees(lista.map(item => item.content || item));
      })
      .catch((err) => console.error("Erro ao buscar funcionários:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const agendamento = {
      timestamp: datetime,
      chargedPrice: parseFloat(price),
      description,
      serviceTypeId: parseInt(serviceTypeId),
      petId: parseInt(selectedPet),
      employeeId: parseInt(selectedEmployee)
    };

    axios.post("http://localhost:8080/api/service-records", agendamento)
      .then(() => alert("Agendamento realizado com sucesso!"))
      .catch((err) => {
        console.error("Erro ao agendar:", err);
        alert("Erro ao realizar o agendamento. Verifique os campos.");
      });
  };

  return (
    <div className="form-container">
      <header>
        <h1>Agendamento de Serviços</h1>
      </header>
      <Menu />

      <form onSubmit={handleSubmit}>
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

        <label>Pet:</label>
        <select
          className="form-select"
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
        >
          <option value="">Selecione um pet</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

        <label>Funcionário Responsável:</label>
        <select
          className="form-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Selecione um funcionário</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.username}
            </option>
          ))}
        </select>

        <label>ID do Tipo de Serviço:</label>
        <input
          className="form-control"
          type="number"
          value={serviceTypeId}
          onChange={(e) => setServiceTypeId(e.target.value)}
        />

        <label>Data e Hora:</label>
        <input
          className="form-control"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        />

        <label>Descrição:</label>
        <input
          className="form-control"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Preço:</label>
        <input
          className="form-control"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit" className="btn btn-primary mt-3">Agendar</button>
      </form>
    </div>
  );
}
