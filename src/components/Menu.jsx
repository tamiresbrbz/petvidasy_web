import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav>
      <Link to="/"><button>Home</button></Link>
      <Link to="/cadastro"><button>Cadastros de Clientes</button></Link>
      <Link to="/Agendamentos"><button>Agendamentos de Serviços</button></Link>
      <Link to="/vendas"><button>Registro de Vendas</button></Link>
      <Link to="/relatorios"><button>Emissão de Relatórios</button></Link>
      <Link to="/Funcionarios"><button>Cadastro de Funcionários</button></Link>
      <Link to="/CadastroServicosProdutos"><button>Cadastro de Produtos e Serviços</button></Link>
    </nav>
  );
}

export default Menu;
