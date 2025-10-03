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
conexao.connect((error)=> {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:',error);
        return;
    }
    console.log('Conexão com banco de dados estabelecida com sucesso!');
}); 

app.get("/", (req, res) => {
    res.render('index');
}
);


app.listen(8041)