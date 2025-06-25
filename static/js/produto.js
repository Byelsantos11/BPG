// Variáveis modal e botões
const modal = document.getElementById("modal-produto");
const btnNovoProduto = document.getElementById("btn-novo-produto");
const btnCancelar = document.getElementById("btn-cancelar");
const formProduto = document.getElementById("form-produto");
const modalTitle = document.getElementById("modal-title");
const btnSalvar = document.getElementById("btn-salvar");
const tabelaProdutos = document.getElementById("tabela-produtos");
const inputPesquisa = document.getElementById("pesquisa-produto");

let produtosCache = [];
let produtoIdEditar = null; // id do produto em edição

// Mostrar modal para novo produto
btnNovoProduto.addEventListener("click", () => {
  produtoIdEditar = null;
  modalTitle.textContent = "Novo Produto";
  formProduto.reset();
  modal.classList.add("show");
});

// Cancelar modal
btnCancelar.addEventListener("click", () => {
  modal.classList.remove("show");
  produtoIdEditar = null;
});

// Fechar modal clicando fora do conteúdo
modal.addEventListener("click", (e) => {
  if(e.target === modal){
    modal.classList.remove("show");
    produtoIdEditar = null;
  }
});

// Carregar produtos do backend
async function carregarProdutos() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Acesso negado! Faça login.");
    return;
  }

  tabelaProdutos.innerHTML = `<tr><td colspan="5">Carregando produtos...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/produtos/listarProdutos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      tabelaProdutos.innerHTML = `<tr><td colspan="5">Erro ao buscar produtos</td></tr>`;
      return;
    }

    const data = await res.json();
    produtosCache = data.produtos || [];
    exibirProdutos(produtosCache);

  } catch (error) {
    tabelaProdutos.innerHTML = `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
    console.error(error);
  }
}

// Exibir produtos na tabela
function exibirProdutos(listaProdutos) {
  if (listaProdutos.length === 0) {
    tabelaProdutos.innerHTML = `<tr><td colspan="5">Nenhum produto encontrado.</td></tr>`;
    return;
  }

  tabelaProdutos.innerHTML = "";

  listaProdutos.forEach(produto => {
    tabelaProdutos.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>
          <button class="editar" data-id="${produto.id}" title="Editar produto">
            ✏️
          </button>
          <button class="deletar" data-id="${produto.id}" title="Deletar produto">
            🗑️
          </button>
        </td>
      </tr>
    `;
  });

  // Botões editar
  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-id");
      produtoIdEditar = id;
      const produto = produtosCache.find(p => p.id == id);
      if (!produto) return alert("Produto não encontrado!");

      modalTitle.textContent = "Editar Produto";
      formProduto.nome.value = produto.nome;
      formProduto.categoria.value = produto.categoria;
      formProduto.preco.value = produto.preco;
      formProduto.quantidade.value = produto.quantidade;

      modal.classList.add("show");
    });
  });

  // Botões deletar
  document.querySelectorAll(".deletar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Tem certeza que deseja deletar este produto?")) {
        await deletarProduto(id);
        carregarProdutos();
      }
    });
  });
}

// Cadastrar novo produto ou editar existente
formProduto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Usuário não autenticado!");
    return;
  }

  const produto = {
    nome: formProduto.nome.value.trim(),
    categoria: formProduto.categoria.value.trim(),
    preco: parseFloat(formProduto.preco.value),
    quantidade: parseInt(formProduto.quantidade.value),
  };

  if (!produto.nome || !produto.categoria || isNaN(produto.preco) || isNaN(produto.quantidade)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    let res;

    if (produtoIdEditar) {
      // Editar
      res = await fetch(`http://localhost:5000/api/produtos/editarProduto/${produtoIdEditar}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(produto)
      });
    } else {
      // Novo produto
      res = await fetch("http://localhost:5000/api/produtos/criarProduto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(produto)
      });
    }

    if (res.ok) {
      alert(produtoIdEditar ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      modal.classList.remove("show");
      produtoIdEditar = null;
      formProduto.reset();
      carregarProdutos();
    } else {
      const erro = await res.json();
      alert(`Erro: ${erro?.message || res.status}`);
    }

  } catch (error) {
    alert("Erro na conexão com o servidor.");
    console.error(error);
  }
});

// Deletar produto
async function deletarProduto(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/produtos/excluirProduto/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Erro ao deletar produto!");
    }
  } catch (error) {
    alert("Erro na conexão com o servidor!");
    console.error(error);
  }
}

// Pesquisa produtos
inputPesquisa.addEventListener("input", () => {
  const termo = inputPesquisa.value.toLowerCase().trim();

  const produtosFiltrados = produtosCache.filter(produto => {
    return (
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo)
    );
  });

  exibirProdutos(produtosFiltrados);
});

// Botão sair (igual clientes e dashboard)
const sair = document.getElementById("sair");
sair.addEventListener("click", () => {
  sair.textContent = "Saindo...";
  localStorage.removeItem("token");
  setTimeout(() => window.location.href = "./Login.html", 1000);
});

// Carregar produtos ao abrir a página
carregarProdutos();
