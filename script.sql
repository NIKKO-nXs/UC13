--Criação do banco de dados 
CREATE DATABASE IF NOT EXISTS ecommerce_pc
    DEFAULT CHARACTER SET = 'utf8mb4';

--Sinalizando a utilização dp banco
USE ecommerce_pc;

CREATE TABLE Cliente(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    endereco TEXT
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categoria(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descriacao TEXT
);

CREATE TABLE Produto(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descriacao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT DEFAULT 0,
    categoria INT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria) REFERENCES Categoria(id)
);

CREATE TABLE Pedido(
    id INT  AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Em andamento',
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id) 
);

CREATE TABLE Item_Pedido(
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT DEFAULT 1,
    preco_unitario DECIMAL(10,2),
    FOREIGN KEY (pedido_id) REFERENCES Pedido(id),
    FOREIGN KEY (produto_id) REFERENCES Produto(id)
);

INSERT INTO Categoria (nome,descriacao) VALUES
('Processador','CPUs para desktops'),
('Memório RAM','Módulos de memória para PCs'),
('Placas de Video','GPUs para jogos e renderização'),
('Armazenamento','Dispositivos como SSDs e HDs'),
('Placa-Mães','Motherboards compatíveis com CPus e periféricos');

INSERT INTO Produto(nome,descriacao,preco,estoque,categoria) VALUES
('Intel Core 5-10400','6-núcleos, 12 threads 2.9GHz', 899.90, 10, 1),
('AMD Ryzen 5 5600X','6 núcleos, até 4.6GHz', 1099.00, 7, 1),
('Memória DDR4 8GB 2666MHz','Kingston Fury Beast', 189.90, 20, 2),
('Memória DDR4 16GB 3200MGHz','Corsair Vengeance LPX', 349.50, 15, 2),
('NVIDIA GeForce GTX 1660','6GB GDDR5', 1450.00,5 ,3);