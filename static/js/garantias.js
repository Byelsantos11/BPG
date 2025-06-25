const tabelaGarantias = document.getElementById("tabela-garantias");
const btnSair = document.getElementById("sair");

async function carregarGarantias(){
  const token = localStorage.getItem("token");
  if(!token){
    alert("Acesso negado! Faça login.");
    window.location.href = "./Login.html";
    return;
  }

  tabelaGarantias.innerHTML = `<tr><td colspan="5">Carregando garantias...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/garantias/listar", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if(!res.ok){
      tabelaGarantias.innerHTML = `<tr><td colspan="5">Erro ao carregar garantias</td></tr>`;
      return;
    }

    const data = await res.json();

    if(!data.garantias || data.garantias.length === 0){
      tabelaGarantias.innerHTML = `<tr><td colspan="5">Nenhuma garantia encontrada.</td></tr>`;
      return;
    }

    tabelaGarantias.innerHTML = "";

    data.garantias.forEach(g => {
      tabelaGarantias.innerHTML += `
        <tr>
          <td>${g.cliente}</td>
          <td>${g.produto}</td>
          <td>${new Date(g.dataInicio).toLocaleDateString('pt-BR')}</td>
          <td>${new Date(g.dataFim).toLocaleDateString('pt-BR')}</td>
          <td>${g.status}</td>
        </tr>
      `;
    });

  } catch(err){
    tabelaGarantias.innerHTML = `<tr><td colspan="5">Erro ao carregar garantias</td></tr>`;
    console.error(err);
  }
}

// Botão sair
btnSair.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
});

// Carrega garantias ao abrir a página
carregarGarantias();
