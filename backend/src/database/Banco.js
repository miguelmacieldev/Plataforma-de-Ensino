const mysql = require('mysql2/promise');

let conexao = null;

module.exports = {
    getConexao: async () => {
        if (!conexao) {
            conexao = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'plataforma_de_estudos'
            });
        }
        return conexao;
    }
};