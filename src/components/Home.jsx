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
            <Link to="/Cadastro"><button>Cadastro</button></Link>
            <Link to="/Agendamentos"><button>Agendamento</button></Link>
            <Link to="/Vendas"><button>Vendas</button></Link>
            <Link to="/Relatorios"><button>Relatórios</button></Link>
            <Link to="/Funcionarios"><button>Funcionários</button></Link>
            <Link to="/CadastroServicosProdutos"><button>Produtos</button></Link>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
