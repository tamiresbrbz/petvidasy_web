import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav>
      <Link to="/"><button>Home</button></Link>
      <Link to="/cadastro"><button>Cadastros</button></Link>
      <Link to="/Agendamentos"><button>Agendamentos</button></Link>
      <Link to="/vendas"><button>Vendas</button></Link>
      <Link to="/relatorios"><button>Relatórios</button></Link>
      <Link to="/Funcionarios"><button>Funcionários</button></Link>
      <Link to="/CadastroServicosProdutos"><button>Produtos</button></Link>
    </nav>
  );
}

export default Menu;
