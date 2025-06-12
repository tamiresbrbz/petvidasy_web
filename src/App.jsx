import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Cadastro from './components/Cadastro';
import Agendamentos from './components/Agendamentos';
import Vendas from './components/Vendas';
import Relatorios from './components/Relatorios';
import Funcionarios from './components/Funcionarios';
import CadastroServicosProdutos from './components/CadastroServicosProdutos';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Agendamentos" element={<Agendamentos />} />
        <Route path="/Vendas" element={<Vendas />} />
        <Route path="/Relatorios" element={<Relatorios />} />
        <Route path="/Funcionarios" element={<Funcionarios />} />
        <Route path="/CadastroServicosProdutos" element={<CadastroServicosProdutos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


