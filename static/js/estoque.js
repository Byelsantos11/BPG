const tabelaEstoque = document.getElementById("tabela-estoque");
const btnSair = document.getElementById("sair");

async function carregarEstoque() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }

  tabelaEstoque.innerHTML = `<tr><td colspan="4">Carregando estoque...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/estoque/listar", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      tabelaEstoque.innerHTML = `<tr><td colspan="4">Erro ao carregar estoque</td></tr>`;
      return;
    }

    const data = await res.json();

    if (!data.estoque || data.estoque.length === 0) {
      tabelaEstoque.innerHTML = `<tr><td colspan="4">Nenhum produto em estoque.</td></tr>`;
      return;
    }

    tabelaEstoque.innerHTML = "";

    data.estoque.forEach(item => {
      tabelaEstoque.innerHTML += `
        <tr>
          <td>${item.produto}</td>
          <td>${item.quantidade}</td>
          <td>${new Date(item.ultimaAtualizacao).toLocaleDateString('pt-BR')}</td>
          <td>
            <!-- Botões para editar ou outras ações podem ser adicionados -->
            <button class="editar" data-id="${item.id}">Editar</button>
            <button class="deletar" data-id="${item.id}">Excluir</button>
          </td>
        </tr>
      `;
    });

    // Você pode adicionar event listeners para os botões editar e deletar aqui

  } catch (err) {
    tabelaEstoque.innerHTML = `<tr><td colspan="4">Erro ao carregar estoque</td></tr>`;
    console.error(err);
  }
}

btnSair.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
});

carregarEstoque();
