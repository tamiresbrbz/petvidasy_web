import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";

export default function Agendamentos() {
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allPets, setAllPets] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/service-types")
      .then((res) => setServiceTypes(res.data))
      .catch((err) => console.error("Erro ao buscar tipos de serviço:", err));

    axios.get("http://localhost:8080/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));

    axios.get("http://localhost:8080/pets")
      .then((res) => {
        setAllPets(res.data);
      })
      .catch((err) => console.error("Erro ao buscar pets:", err));

    axios.get("http://localhost:8080/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Erro ao buscar funcionários:", err));
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const petsFiltrados = allPets.filter(pet => pet.customerId === parseInt(selectedCustomer));
      setPets(petsFiltrados);
    } else {
      setPets([]);
    }
  }, [selectedCustomer, allPets]);

useEffect(() => {
  const tipoSelecionado = serviceTypes.find(s => String(s.id) === serviceTypeId);
  if (tipoSelecionado) {
    setPrice(tipoSelecionado.price);
  } else {
    setPrice("");
  }
}, [serviceTypeId, serviceTypes]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cliente = customers.find(c => String(c.id) === selectedCustomer);
    const servico = serviceTypes.find(s => String(s.id) === serviceTypeId);

    const agendamento = {
      timestamp: datetime,
      chargedPrice: parseFloat(price),
      description,
      serviceTypeId: parseInt(serviceTypeId),
      petId: parseInt(selectedPet),
      employeeId: parseInt(selectedEmployee),
      customerName: cliente?.name || "",
      serviceName: servico?.name || "",
      status: "AGENDADO"
    };

    axios.post("http://localhost:8080/schedules", agendamento)
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

        <label>Tipo de Serviço:</label>
        <select
          className="form-select"
          value={serviceTypeId}
          onChange={(e) => setServiceTypeId(e.target.value)}
        >
          <option value="">Selecione um tipo de serviço</option>
          {serviceTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

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
          disabled
          readOnly
          style={{ backgroundColor: "#fff", color: "#000", fontWeight: "bold" }}
        />

        <button type="submit" className="btn btn-primary mt-3">Agendar</button>
      </form>
    </div>
  );
}
