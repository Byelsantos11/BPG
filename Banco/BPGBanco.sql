CREATE DATABASE bpgstore;
USE bpgstore;


/*Tabela usuario*/

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/*Tabela de clientes*/

CREATE TABLE IF NOT EXISTS clientes(
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
telefone VARCHAR(20) NOT NULL,
endereco VARCHAR(200) NOT NULL,
cidade VARCHAR(200) NOT NULL,
estado VARCHAR(200) NOT NULL,
data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


/*Tabela produtos*/

CREATE TABLE produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    preco DOUBLE NOT NULL,
    estoque BIGINT NOT NULL,
    descricao TEXT,
    categoria ENUM('Notebooks', 'Smartphones', 'TVs', 'Impressoras', 'Acessórios') NOT NULL
);



/*Tabela serviços*/

CREATE TABLE IF NOT EXISTS servicos (
id BIGINT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
dispositivo VARCHAR(200) NOT NULL,
numero_serie VARCHAR(25) NOT NULL,
tecnico ENUM ('Michel', 'Celso'),
status_servico ENUM('Pendente', 'Em diagnóstico', 'Aguardando peças', 'Em andamento', 'Concluído', 'Cancelado'),
prioridade ENUM('Baixa', 'Média', 'Alta'),
previsao_conclusao DATE,
descricao_problema TEXT,
observacao_tecnica TEXT,
data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
);


/*Tabela Garantias*/

CREATE TABLE garantias (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  produto_id BIGINT,
  pacote_garantia ENUM('Premium', 'Prata', 'Bronze'),
  status_garantia ENUM('Vencida', 'Estendida', 'Cancelada'),
  data_inicio DATE,
  data_expiracao DATE,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE ON UPDATE CASCADE
);




/*Tabela histórico*/