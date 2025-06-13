import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <header>
        <h1>PetVidaSys</h1>
      </header>
      <main>
        <div className="home-container">
          <h2>Bem-vindo ao PetVidaSys!</h2>
          <p>Este sistema foi desenvolvido para facilitar o gerenciamento de agendamentos, vendas, cadastros e relatórios da sua clínica veterinária e pet shop.</p>

          <div className="atalhos">
            <Link to="/Cadastro"><button>Cadastro de Clientes</button></Link>
            <Link to="/Agendamentos"><button>Agendamentos de Serviços</button></Link>
            <Link to="/Vendas"><button>Registro de Vendas</button></Link>
            <Link to="/Relatorios"><button>Emissão de Relatórios</button></Link>
            <Link to="/Funcionarios"><button>Cadastro de Funcionários</button></Link>
            <Link to="/CadastroServicosProdutos"><button>Cadastro de Produtos e Serviços</button></Link>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
