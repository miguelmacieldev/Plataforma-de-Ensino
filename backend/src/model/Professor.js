// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('../database/Banco');

// Define a classe Professor para representar a entidade Professor.
class Professor {
    // Construtor da classe Professor que inicializa as propriedades.
    constructor() {
        this._idProfessor = null;   // ID do professor, inicialmente nulo.
        this._nome = '';            // Nome do professor.
        this._telefone = '';        // Telefone do professor.
        this._senha = '';           // Senha do professor.
    }

    // Método assíncrono para criar um novo professor no banco de dados.
    async create() {
        const conexao = Banco.getConexao();
        const SQL = 'INSERT INTO professor (nome, telefone, senha) VALUES (?, ?, ?);';
        try {
            if (await this.isProfessor()) {
                return false;
            }
            const [result] = await conexao.promise().execute(SQL, [this._nome, this._telefone, this._senha]);
            this._idProfessor = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar o professor:', error.message);
            return false;
        }
    }

    // Método assíncrono para excluir um professor do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM professor WHERE idProfessor = ?;';
        try {
            const [result] = await conexao.promise().execute(SQL, [this._idProfessor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir o professor:', error.message);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de um professor.
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE professor SET nome = ?, telefone = ?, senha = ? WHERE idProfessor = ?;';
        try {
            const [result] = await conexao.promise().execute(SQL, [this._nome, this._telefone, this._senha, this._idProfessor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o professor:', error.message);
            return false;
        }
    }

    // Método assíncrono para verificar se um professor com o mesmo nome e telefone já existe.
    async isProfessor() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM professor WHERE nome = ? AND telefone = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._nome, this._telefone]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar o professor:', error.message);
            return false;
        }
    }

    // Método assíncrono para ler todos os professores do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM professor ORDER BY nome;';
        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler professores:', error.message);
            return [];
        }
    }

    // Método assíncrono para ler um professor pelo ID.
    async readByID() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM professor WHERE idProfessor = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idProfessor]);
            if (rows.length > 0) {
                return rows;
            } else {
                console.log('Nenhum professor encontrado com o ID:', this._idProfessor);
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler professor pelo ID:', error.message);
            return null;
        }
    }

    // Getters e Setters

    get idProfessor() {
        return this._idProfessor;
    }

    set idProfessor(id) {
        this._idProfessor = id;
    }

    get nome() {
        return this._nome;
    }

    set nome(nome) {
        this._nome = nome;
    }

    get telefone() {
        return this._telefone;
    }

    set telefone(telefone) {
        this._telefone = telefone;
    }

    get senha() {
        return this._senha;
    }

    set senha(senha) {
        this._senha = senha;
    }
}

// Exporta a classe Professor para uso em outros módulos.
module.exports = Professor;
