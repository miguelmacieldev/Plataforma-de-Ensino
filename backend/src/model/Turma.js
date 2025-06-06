// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('../database/Banco');

// Define a classe Turma para representar a entidade Turma.
class Turma {
    // Construtor da classe Turma que inicializa as propriedades.
    constructor() {
        this._idTurma = null;     // ID da turma, inicialmente nulo.
        this._descricao = '';     // Descrição da turma, inicialmente vazia.
        this._curso = '';         // Curso da turma, inicialmente vazio.
    }

    // Método assíncrono para criar uma nova turma no banco de dados.
    async create() {
        const conexao = await Banco.getConexao();
        const SQL = 'INSERT INTO turma (descricao, curso) VALUES (?, ?);';
        try {
            if (await this.isTurma()) {
                return false;
            }
            const [result] = await conexao.execute(SQL, [this._descricao, this._curso]);
            this._idTurma = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar a turma:', error.message);
            return false;
        }
    }

    // Método assíncrono para excluir uma turma do banco de dados.
    async delete() {
        const conexao = await Banco.getConexao();
        const SQL = 'DELETE FROM turma WHERE idTurma = ?;';
        try {
            const [result] = await conexao.execute(SQL, [this._idTurma]);
            return result.affectedRows > 0;
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return false
            };
            console.error('Erro ao excluir a turma:', error);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de uma turma.
    async update() {
        const conexao = await Banco.getConexao();
        const SQL = 'UPDATE turma SET descricao = ?, curso = ? WHERE idTurma = ?;';
        try {
            if (await this.isTurma()) {
                return false;
            }
            const [result] = await conexao.execute(SQL, [this._descricao, this._curso, this._idTurma]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar a turma:', error);
            return false;
        }
    }

    // Método assíncrono para verificar se uma turma com a mesma descrição e curso já existe.
    async isTurma() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM turma WHERE descricao = ? AND curso = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._descricao, this._curso]);
            return rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar a turma:', error);
            return false;
        }
    }

    // Método assíncrono para ler todas as turmas do banco de dados.
    async readAll() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT * FROM turma ORDER BY descricao;';
        try {
            const [rows] = await conexao.execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler turmas:', error);
            return [];
        }
    }

    // Método assíncrono para ler uma turma pelo ID.
    async readByID() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT * FROM turma WHERE idTurma = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._idTurma]);
            
            // Verifica se retornou algum registro
            if (rows.length > 0) {
                return rows[0];
            } else {
                console.log('Nenhuma turma encontrada com o ID:', this._idTurma);
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler turma pelo ID:', error);
            return null;
        }
    }

    // Getters e Setters

    get idTurma() {
        return this._idTurma;
    }

    set idTurma(id) {
        this._idTurma = id;
    }

    get descricao() {
        return this._descricao;
    }

    set descricao(descricao) {
        this._descricao = descricao;
    }

    get curso() {
        return this._curso;
    }

    set curso(curso) {
        this._curso = curso;
    }
}

// Exporta a classe Turma para uso em outros módulos.
module.exports = Turma;
