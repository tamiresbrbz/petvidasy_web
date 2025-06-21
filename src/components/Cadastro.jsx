import { useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import Cleave from 'cleave.js/react';

function Cadastro() {
  const [formData, setFormData] = useState({
    nomeTutor: '',
    telefoneTutor: '',
    emailTutor: '',
    cpfTutor: '',
    nomePet: '',
    racaPet: '',
    pesoPet: '',
    necessidadesEspeciais: '',
    dataNascimentoPet: ''
  });

  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ POST para cadastrar o tutor no json-server
      const clienteResponse = await axios.post('http://localhost:8080/customers', {
        name: formData.nomeTutor,
        phone: formData.telefoneTutor,
        email: formData.emailTutor,
        cpf: formData.cpfTutor.replace(/\D/g, '') // Remove pontos e traço
      });

      const clienteId = clienteResponse.data.id;

      // ✅ POST para cadastrar o pet vinculado ao tutor
      await axios.post('http://localhost:8080/pets', {
        name: formData.nomePet,
        breed: formData.racaPet,
        weight: parseFloat(formData.pesoPet || 0),
        specialNeeds: formData.necessidadesEspeciais,
        birthDate: formData.dataNascimentoPet,
        customerId: clienteId
      });

      setMensagem('✅ Cadastro realizado com sucesso!');
      alert('Cadastro realizado com sucesso!');

      setFormData({
        nomeTutor: '',
        telefoneTutor: '',
        emailTutor: '',
        cpfTutor: '',
        nomePet: '',
        racaPet: '',
        pesoPet: '',
        necessidadesEspeciais: '',
        dataNascimentoPet: ''
      });

    } catch (error) {
      console.error(error);
      setMensagem('❌ Erro ao realizar cadastro. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div>
      <header>
        <h1>Cadastro de Tutor e Pet</h1>
      </header>
      <Menu />
      <main>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados do Tutor</legend>
            <label>Nome:</label>
            <input type="text" name="nomeTutor" value={formData.nomeTutor} onChange={handleChange} required /><br />

            <label>Telefone:</label>
            <Cleave
              options={{ delimiters: ['(', ') ', '-', ''], blocks: [0, 2, 5, 4], numericOnly: true }}
              name="telefoneTutor"
              value={formData.telefoneTutor}
              onChange={handleChange}
              placeholder="(11) 91234-5678"
              required
            /><br />

            <label>E-mail:</label>
            <input type="email" name="emailTutor" value={formData.emailTutor} onChange={handleChange} required /><br />

            <label>CPF:</label>
            <Cleave
              options={{ delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true }}
              name="cpfTutor"
              value={formData.cpfTutor}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
            /><br />
          </fieldset>

          <fieldset>
            <legend>Dados do Pet</legend>
            <label>Nome:</label>
            <input type="text" name="nomePet" value={formData.nomePet} onChange={handleChange} required /><br />
            <label>Raça:</label>
            <input type="text" name="racaPet" value={formData.racaPet} onChange={handleChange} /><br />
            <label>Peso (kg):</label>
            <input type="number" name="pesoPet" value={formData.pesoPet} onChange={handleChange} step="0.1" /><br />
            <label>Necessidades Especiais:</label>
            <input type="text" name="necessidadesEspeciais" value={formData.necessidadesEspeciais} onChange={handleChange} /><br />
            <label>Data de Nascimento:</label>
            <input type="date" name="dataNascimentoPet" value={formData.dataNascimentoPet} onChange={handleChange} /><br />
          </fieldset>

          <button type="submit">Cadastrar</button>
          {mensagem && <p style={{ color: mensagem.startsWith('✅') ? 'limegreen' : 'red', marginTop: '1em' }}>{mensagem}</p>}
        </form>
      </main>
    </div>
  );
}

export default Cadastro;
