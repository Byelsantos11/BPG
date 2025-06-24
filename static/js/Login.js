const btnEntrar = document.getElementById("entrar");

btnEntrar.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (email === "" || senha === "") {
    alert("Preencha todos os campos!");
    return;
  }

  // Desativa o botão temporariamente
  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email,  password: senha })
    });

    if (!response.ok) {
      // tenta extrair mensagem de erro do backend, se houver
      const errorData = await response.json();
      const errorMsg = errorData.message || "Falha ao fazer login.";
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('Login realizado com sucesso:', data);

   
    localStorage.setItem('token', data.token);

    // Redireciona após login
    window.location.href = "./dashboard.html";

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert(error.message || "Email ou senha inválidos!");
  } finally {
    // Reativa o botão
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});
