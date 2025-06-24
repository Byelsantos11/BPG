// Variável do botão sair
const sair = document.getElementById("sair");

sair.addEventListener("click", () => {
  // Atualiza texto do botão
  sair.textContent = "Saindo...";

  // Remove token
  localStorage.removeItem('token');

  // Aguarda 1 segundo antes de redirecionar
  setTimeout(() => {
    window.location.href = "./Login.html";
  }, 1000);
});


//Requição quantidade clientes



//Requisição quantidade produtos



//Requisição quantidade serviços ativos 


