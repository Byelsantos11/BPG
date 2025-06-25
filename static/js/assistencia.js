// Sair 
const sair = document.getElementById("sair");
sair.addEventListener("click", () => {
  sair.textContent = "Saindo...";
  localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "./Login.html";
  }, 1000);
});

// Variáveis 
const btnNovoServico = document.getElementById("btn-novo-servico");
const formServico = document.getElementById("form-servico");
const cancelar = document.getElementById("cancelar");
const form = document.getElementById("service-form");
const lista = document.getElementById("tabela-servicos");
const buscaInput = document.getElementById("pesquisa-servico");

let servicosCarregados = [];

// Abrir formulário
btnNovoServico.addEventListener("click", () => {
  document.getElementById("titulo-form-servico").textContent = "Novo Serviço";
  document.getElementById("servico_id").value = "";
  formServico.classList.remove("oculto");
  form.reset();
});

// Fechar formulário
cancelar.addEventListener("click", () => {
  formServico.classList.add("oculto");
  form.reset();
});

// Submeter formulário (criar ou editar)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado!");

  const id = document.getElementById("servico_id").value;

  const servico = {
    user_id: document.getElementById("user_id").value,
    dispositivo: document.getElementById("dispositivo").value.trim(),
    numero_serie: document.getElementById("numero_serie").value.trim(),
    tecnico: document.getElementById("tecnico").value,
    status_servico: document.getElementById("status").value,
    prioridade: document.getElementById("prioridade").value,
    previsao_conclusao: document.getElementById("previsao_conclusao").value,
    descricao_problema: document.getElementById("descricao_problema").value.trim(),
    observacao_tecnica: document.getElementById("observacao_tecnica").value.trim()
  };

  const url = id
    ? `http://localhost:5000/api/servicos/editarServico/${id}`
    : `http://localhost:5000/api/servicos/criarServico`;

  const metodo = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(servico),
    });

    if (res.ok) {
      alert(`Serviço ${id ? "atualizado" : "cadastrado"} com sucesso!`);
      form.reset();
      document.getElementById("servico_id").value = "";
      document.getElementById("titulo-form-servico").textContent = "Novo Serviço";
      formServico.classList.add("oculto");
      carregarServico();
    } else {
      const erro = await res.json();
      alert(`Erro ao salvar serviço: ${erro?.message || res.status}`);
    }
  } catch (erro) {
    alert("Erro na conexão com o servidor.");
    console.error(erro);
  }
});

// Carregar clientes no formulário
async function carregarClientesNoFormulario() {
  const token = localStorage.getItem("token");
  const select = document.getElementById("user_id");

  try {
    const res = await fetch("http://localhost:5000/api/clientes/listaCliente", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    select.innerHTML = `<option value="" disabled selected>Selecione o cliente</option>`;
    data.clientes.forEach(cliente => {
      const opt = document.createElement("option");
      opt.value = cliente.id;
      opt.textContent = cliente.nome;
      select.appendChild(opt);
    });
  } catch (err) {
    alert("Erro ao carregar clientes.");
    console.error(err);
  }
}

// Carregar serviços
async function carregarServico() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado!");

  try {
    const res = await fetch("http://localhost:5000/api/servicos/listarServico", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Erro ao carregar serviços.");
      return;
    }

    const data = await res.json();
    servicosCarregados = Array.isArray(data) ? data : [];
    popularTabela(servicosCarregados);

  } catch (erro) {
    alert("Erro na conexão com o servidor.");
    console.error(erro);
  }
}

// Exibir serviços na tabela
function popularTabela(listaServicos) {
  if (!listaServicos || listaServicos.length === 0) {
    lista.innerHTML = "<tr><td colspan='5'>Nenhum serviço encontrado.</td></tr>";
    return;
  }

  lista.innerHTML = "";
  listaServicos.forEach((s) => {
    lista.innerHTML += `
      <tr>
        <td>${s.cliente?.nome || "Não informado"}</td>
        <td>${s.dispositivo}</td>
        <td>${s.numero_serie}</td>
         <td>${s.descricao_problema}</td>
          <td>${s.tecnico}</td>
        <td>${new Date(s.previsao_conclusao).toLocaleDateString("pt-BR")}</td>
        <td>${s.status_servico}</td>
        <td>${s.prioridade}</td>
        <td>
          <button class="editar" data-id="${s.id}">✏️</button>
          <button class="deletar" data-id="${s.id}">🗑️</button>
        </td>
      </tr>
    `;
  });
}

// Deletar serviço
lista.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Usuário não autenticado!");

  const id = e.target.getAttribute("data-id");
  if (!id) return;

  if (e.target.classList.contains("deletar")) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/servicos/excluirServico/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        carregarServico();
      } else {
        const erro = await res.json();
        alert(`Erro ao excluir serviço: ${erro?.message || res.status}`);
      }
    } catch (erro) {
      alert("Erro na conexão com o servidor.");
      console.error(erro);
    }
  }

  if (e.target.classList.contains("editar")) {
    try {
      const servico = servicosCarregados.find(s => s.id == id);
      if (!servico) return alert("Serviço não encontrado.");

      // Preenche o formulário
      document.getElementById("servico_id").value = servico.id;
      document.getElementById("user_id").value = servico.user_id;
      document.getElementById("dispositivo").value = servico.dispositivo;
      document.getElementById("numero_serie").value = servico.numero_serie;
      document.getElementById("tecnico").value = servico.tecnico;
      document.getElementById("status").value = servico.status_servico;
      document.getElementById("prioridade").value = servico.prioridade;
      document.getElementById("previsao_conclusao").value = servico.previsao_conclusao?.split("T")[0] || "";
      document.getElementById("descricao_problema").value = servico.descricao_problema || "";
      document.getElementById("observacao_tecnica").value = servico.observacao_tecnica || "";

      document.getElementById("titulo-form-servico").textContent = "Editar Serviço";
      formServico.classList.remove("oculto");

    } catch (err) {
      alert("Erro ao carregar dados do serviço.");
      console.error(err);
    }
  }
});

// Filtro pela barra de pesquisa
buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.trim().toLowerCase();

  if (!termo) {
    popularTabela(servicosCarregados);
    return;
  }

  const filtrados = servicosCarregados.filter(s => {
    const nomeCliente = s.cliente?.nome?.toLowerCase() || "";
    const dispositivo = s.dispositivo.toLowerCase();
    const status = s.status_servico.toLowerCase();
    const numSerie = s.numero_serie.toLowerCase();

    return (
      nomeCliente.includes(termo) ||
      dispositivo.includes(termo) ||
      status.includes(termo) ||
      numSerie.includes(termo)
    );
  });

  popularTabela(filtrados);
});

// Inicializar
carregarClientesNoFormulario();
carregarServico();
