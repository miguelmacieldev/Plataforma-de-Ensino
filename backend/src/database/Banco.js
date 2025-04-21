const mysql = require('mysql2');

// Cria a conexão com o banco de dados
const conexao = mysql.createConnection({
    host: 'localhost',      // ou o IP do banco de dados
    user: 'root',
    password: '081203m@teus',
    database: 'plataforma_de_estudos'
});

// Tenta conectar
conexao.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

// Exporta uma função para obter essa conexão
module.exports = {
    getConexao: () => conexao
};
