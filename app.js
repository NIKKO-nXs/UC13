const express = require('express');
const app = express();
const mysql = require('mysql2');
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senac',
    port: '3306',
    database: 'ecommerce_pc'
});

conexao.connect((error)=> {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:',error);
        return;
    }
    console.log('Conexão com banco de dados estabelecida com sucesso!');
}); 

app.get("/", function(req, res){
    res.write("Olá, mundo");
    res.end();
});


app.listen(8080);