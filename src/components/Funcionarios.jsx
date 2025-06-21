import React, { useState } from 'react';
import axios from 'axios';
import Menu from './Menu'; // Certifique-se de ter este componente

export default function Funcionarios() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'ADMIN',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Enviando funcionário:", formData);

  axios.post('http://localhost:8080/employees', formData)
    .then(response => {
      alert('Funcionário cadastrado com sucesso!');
      console.log(response.data);
      setFormData({
        username: '',
        password: '',
        email: '',
        role: 'ADMIN',
        isActive: true
      });
    })
    .catch(error => {
      console.error('Erro ao cadastrar funcionário:', error);
      alert('Erro ao cadastrar funcionário. Verifique os dados e tente novamente.');
    });
};


  return (
    <div>
      <header>
        <h1>Cadastro de Funcionário</h1>
        <p>Utilize o formulário abaixo para cadastrar novos funcionários.</p>
        <Menu />
      </header>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Função:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label>
            Ativo:
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
