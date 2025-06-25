const modal = document.getElementById("modal-servico");
const btnNovoServico = document.getElementById("btn-novo-servico");
const btnCancelar = document.getElementById("btn-cancelar");
const formServico = document.getElementById("form-servico");
const modalTitle = document.getElementById("modal-title");
const tabelaServicos = document.getElementById("tabela-servicos");
const inputPesquisa = document.getElementById("pesquisa-servico");

let servicosCache = [];
let servicoIdEditar = null;

// Abrir modal novo serviço
btnNovoServico.addEventListener("click", () => {
  servicoIdEditar = null;
  modalTitle.textContent = "Novo Serviço";
  formServico.reset();
  modal.classList.add("show");
});

// Cancelar modal
btnCancelar.addEventListener("click", () => {
  modal.classList.remove("show");
  servicoIdEditar = null;
});

// Fechar modal clicando fora
modal.addEventListener("click", e => {
  if(e.target === modal){
    modal.classList.remove("show");
    servicoIdEditar = null;
  }
});

// Carregar serviços do backend
async function carregarServicos(){
  const token = localStorage.getItem("token");
  if(!token){
    alert("Acesso negado! Faça login.");
    return;
  }

  tabelaServicos.innerHTML = `<tr><td colspan="5">Carregando serviços...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/assistencia/listarServicos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(!res.ok){
      tabelaServicos.innerHTML = `<tr><td colspan="5">Erro ao buscar serviços</td></tr>`;
      return;
    }

    const data = await res.json();
    servicosCache = data.servicos || [];
    exibirServicos(servicosCache);

  } catch(error){
    tabelaServicos.innerHTML = `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
    console.error(error);
  }
}

// Exibir serviços na tabela
function exibirServicos(lista){
  if(lista.length === 0){
    tabelaServicos.innerHTML = `<tr><td colspan="5">Nenhum serviço encontrado.</td></tr>`;
    return;
  }

  tabelaServicos.innerHTML = "";

  lista.forEach(servico => {
    tabelaServicos.innerHTML += `
      <tr>
        <td>${servico.cliente}</td>
        <td>${servico.dispositivo}</td>
        <td>${servico.status}</td>
        <td>${new Date(servico.data).toLocaleDateString('pt-BR')}</td>
        <td>
          <button class="editar" data-id="${servico.id}" title="Editar serviço">✏️</button>
          <button class="deletar" data-id="${servico.id}" title="Deletar serviço">🗑️</button>
        </td>
      </tr>
    `;
  });

  // Botões editar
  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      servicoIdEditar = id;
      const servico = servicosCache.find(s => s.id == id);
      if(!servico) return alert("Serviço não encontrado!");

      modalTitle.textContent = "Editar Serviço";
      formServico.cliente.value = servico.cliente;
      formServico.dispositivo.value = servico.dispositivo;
      formServico.status.value = servico.status;
      formServico.data.value = servico.data.split("T")[0]; // YYYY-MM-DD

      modal.classList.add("show");
    });
  });

  // Botões deletar
  document.querySelectorAll(".deletar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if(confirm("Tem certeza que deseja deletar este serviço?")){
        await deletarServico(id);
        carregarServicos();
      }
    });
  });
}

// Salvar ou editar serviço
formServico.addEventListener("submit", async e => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if(!token){
    alert("Usuário não autenticado!");
    return;
  }

  const servico = {
    cliente: formServico.cliente.value.trim(),
    dispositivo: formServico.dispositivo.value.trim(),
    status: formServico.status.value,
    data: formServico.data.value
  };

  if(!servico.cliente || !servico.dispositivo || !servico.status || !servico.data){
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    let res;

    if(servicoIdEditar){
      // Editar
      res = await fetch(`http://localhost:5000/api/assistencia/editarServico/${servicoIdEditar}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(servico)
      });
    } else {
      // Novo serviço
      res = await fetch("http://localhost:5000/api/assistencia/criarServico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(servico)
      });
    }

    if(res.ok){
      alert(servicoIdEditar ? "Serviço atualizado com sucesso!" : "Serviço criado com sucesso!");
      modal.classList.remove("show");
      servicoIdEditar = null;
      formServico.reset();
      carregarServicos();
    } else {
      const erro = await res.json();
      alert(`Erro: ${erro?.message || res.status}`);
    }

  } catch(error){
    alert("Erro na conexão com o servidor.");
    console.error(error);
  }
});

// Deletar serviço
async function deletarServico(id){
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/assistencia/excluirServico/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(!res.ok){
      alert("Erro ao deletar serviço!");
    }
  } catch(error){
    alert("Erro na conexão com o servidor!");
    console.error(error);
  }
}

// Pesquisa serviços
inputPesquisa.addEventListener("input", () => {
  const termo = inputPesquisa.value.toLowerCase().trim();

  const filtrados = servicosCache.filter(s => {
    return (
      s.cliente.toLowerCase().includes(termo) ||
      s.dispositivo.toLowerCase().includes(termo) ||
      s.status.toLowerCase().includes(termo) ||
      new Date(s.data).toLocaleDateString('pt-BR').includes(termo)
    );
  });

  exibirServicos(filtrados);
});

// Botão sair
const sair = document.getElem
