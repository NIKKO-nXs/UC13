const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    port: '3306',
    database: 'ecommerce_pc'
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/bootstrap', express.static(__dirname + './node_modules/bootstrap/dist'));
app.use('/static', express.static(__dirname + '/static'));

const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(session({
    secret: 'chave-secreta-unica-segura',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

app.use(express.urlencoded({ extended: true}));
conexao.connect((error)=> {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:',error);
        return;
    }
    console.log('Conexão com banco de dados estabelecida com sucesso!');
}); 

app.get('/', (req, res) => {
    let sql = 'SELECT * FROM Produto';
    conexao.query(sql, function (error ,produtos_qs) {
        if(error) {
            console.error('Erro ao consultar produtos:', error);
            resizeBy.status(500).send('Erro ao consultar');
            return;
        }
        res.render('index',{ produtos: produtos_qs});
    });
}
);

app.get('/Cliente', (req, res) => {
    let sql = 'SELECT * FROM Cliente';
    conexao.query(sql, function (erro ,Cliente_qs){
        if(erro) {
            console.error('Erro ao consulta Clientes:', erro);
            res.status(500).send('Erro ao Consulta Cliente');
            return;
        }
        res.render('cliente',{ clientes: Cliente_qs});
    });
}
);

app.get('/produtos/add', (req, res) => {
  let sql = 'SELECT id, nome FROM Categoria';

  conexao.query(sql, function (erro, categorias_qs) {
    if (erro) {
      console.error('😫 Erro ao consultar categorias:', erro);
      res.status(500).send('Erro ao consultar categorias');
      return;
    }

    res.render('produto_form', { categorias: categorias_qs });
  });
});

app.post('/produtos/add',(req, res) => {
    const {nome, descricao, preco, estoque, categoria_id } = req.body;
    console.log(req.body)
    const sql = `INSERT INTO Produto (nome, descricao, preco, estoque, categoria_id) VALUES (?, ?, ?, ?, ?,)`;
    conexao.query(sql, [nome, descricao, preco, estoque, categoria_id], (erro, resultado) => {
        if(erro){
            console.erro('Erro ao inserir produto', erro);
            return res.status(500).send('Erro ao adicionar produto.');
        }
        res.redirect('/');
    });    
});

app.post('/categoria/add', (req, res) => {
    const {nome, descriacao} = req.body;
    
    const sql = `INSERT INTO Categoria (nome, descriacao) VALUES (?, ?)`;
    conexao.query(sql, [nome, descriacao], (erro, resultado) => {
        if(erro){
            console.error('Erro ao inserir Caterogia', erro);
            return res.status(500).send('Erro ao adicionar Categoria')
        }
    });
});

app.get('/categoria/add', (req, res) =>{
        res.render('categoria')
    });
app.get('/produtos/:id', (req, res) => {
    const id =  req.params.id;
    const sql = `SELECT Produto.*,categoria.nome AS categoria.nome FROM Produto JOIN categoria ON produto.categoria_id = categoria.id WHERE Produto.id = ?`;
    conexao.query(sql, [id], function(erro, produtos_qs){
        if(erro) {
            console.error('Erro ao consultar produto:', erro);
            res.status(500).send('Erro ao Consultar produto');
            return;
        }
        if (produtos_qs.length === 0) {
            return res.status(404).send('Produto não encontrado');
        }
        res.render('produto', { produto: produtos_qs[0]});
    });
});
app.get('/categoria', (req, res) => {
    let sql = 'SELECT * FROM Categoria';
    conexao.query(sql, (erro, categorias_qs) => {
        if(erro) {
            console.error('Erro ao consultar categoria', erro);
            res.status(500).send('Erro ao Buscar categoria');
            return;
        }
        res.render('categoria_tabela', { Categoria: categorias_qs });
    });
});
app.get('/clientes/cadastrar', (req, res) => {
    res.render('cliente_cadastro');
});

app.post('/clientes/cadastrar', (req, res) => {
    const { nome, email, endereco, senha } = req.body; 

    bcrypt.hash(senha, 10, (erro, hash) => {
        if (erro) {
            console.error('Erro ao criptografar a senha', erro);
            return res.status(500).send('Erro interno no servidor');
        } 
        const sqlUsuario = `INSERT INTO Usuario (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`;
        conexao.query(sqlUsuario, [nome, email, hash, 'commun'], (erro, resultado) => {
            if (erro) {
                console.error('Erro ao inserir usuário', erro);
                return res.status(500).send('Erro ao cadastrar usuário.');
            }
            const usuario_id = resultado.insertId;
            const sqlCliente = `INSERT INTO Cliente (nome, endereco, usuario_id) VALUES (?, ?, ?)`;
            conexao.query(sqlCliente, [nome, endereco, usuario_id], (erro2) => {       
                if (erro2) {
                    console.error('Erro ao inserir cliente', erro2);
                    return res.status(500).send('Erro ao cadastrar cliente.');
                }
                res.redirect('/login');
            });
        });
    }); 
}); 

app.listen(8080);