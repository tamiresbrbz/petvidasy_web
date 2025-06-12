function menu() {
    const menu = document.getElementById('menu');
    menu.innerHTML = `
        <nav>
            <a href="index.html"><button>Home</button></a>
            <a href="Cadastros.html"><button>Cadastros</button></a>
            <a href="Agendamentos.html"><button>Agendamentos</button></a>
            <a href="Vendas.html"><button>Vendas</button></a>
            <a href="Relatorios.html"><button>Relatórios</button></a>
        </nav>
    `;
}

