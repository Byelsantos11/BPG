document.getElementById("form-login").addEventListener("submit", async (event) => {
  event.preventDefault();

  //Variáveis dos campos de login
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const btnEntrar = document.getElementById("entrar");

  //Verificação de vazio
  if (email === "" || senha === "") {
    alert("Preencha todos os campos!");
    return;
  }

  // Validação simples de email (opcional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Digite um e-mail válido!");
    return;
  }

  //Interação de desabilitar botão 
  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  //Requisição de Login (fetch)
  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: email, password: senha }) // Altere para `email` se necessário
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.message || "Falha ao fazer login.";
      throw new Error(errorMsg);
    }

    //Guardar o token
    const data = await response.json();
    localStorage.setItem("token", data.token);

    // Redirecionar para o dashboard
    window.location.href = "./dashboard.html";
  } catch (error) {
    alert(error.message || "Email ou senha inválidos!");
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});
