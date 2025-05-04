const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',     
    user: 'root',
    password: '081203m@teus',
    database: 'plataforma_de_estudos'
});

conexao.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

module.exports = {
    getConexao: () => conexao
};
