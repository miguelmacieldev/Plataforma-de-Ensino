// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('../database/Banco');

// Define a classe Disciplina para representar a entidade Disciplina.
class Disciplina {
    // Construtor da classe Disciplina que inicializa as propriedades.
    constructor() {
        this._idDisciplina = null; // ID da disciplina, auto incremento
        this._idTurma = null;      // ID da turma relacionada
        this._nome = '';           // Nome da disciplina
    }

    // Método assíncrono para criar uma nova disciplina no banco de dados.
    async create() {
        const conexao = Banco.getConexao();
        const SQL = 'INSERT INTO disciplina (idTurma, nome) VALUES (?, ?);';
        try {
            if (!(await this.isTurmaValida())) {
                console.error('Turma não encontrada para o idTurma informado.');
                return false;
            }

            if (await this.isDisciplina()) {
                return false;
            }

            const [result] = await conexao.promise().execute(SQL, [this._idTurma, this._nome]);
            this._idDisciplina = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar a disciplina:', error.message);
            return false;
        }
    }

    // Método assíncrono para excluir uma disciplina do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM disciplina WHERE idDisciplina = ?;';
        try {
            const [result] = await conexao.promise().execute(SQL, [this._idDisciplina]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir a disciplina:', error.message);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de uma disciplina.
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE disciplina SET idTurma = ?, nome = ? WHERE idDisciplina = ?;';
        try {
            if (!(await this.isTurmaValida())) {
                console.error('Turma não encontrada para o idTurma informado.');
                return false;
            }

            const [result] = await conexao.promise().execute(SQL, [this._idTurma, this._nome, this._idDisciplina]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar a disciplina:', error.message);
            return false;
        }
    }

    // Método assíncrono para verificar se já existe uma disciplina com o mesmo nome e turma.
    async isDisciplina() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM disciplina WHERE nome = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._nome]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar a disciplina:', error.message);
            return false;
        }
    }

    // Método assíncrono para verificar se o idTurma existe na tabela turma.
    async isTurmaValida() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM turma WHERE idTurma = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idTurma]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar a existência da turma:', error.message);
            return false;
        }
    }

    // Método assíncrono para ler todas as disciplinas do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = `
                    SELECT 
                        d.idDisciplina,
                        d.nome,
                        d.idTurma
                    FROM disciplina d
                    ORDER BY d.nome;

                `;
        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler disciplinas:', error.message);
            return [];
        }
    }

    // Método assíncrono para ler uma disciplina pelo ID.
    async readByID() {
        const conexao = Banco.getConexao();
        const SQL = `
                    SELECT 
                        d.idDisciplina,
                        d.nome,
                        d.idTurma
                    FROM disciplina d
                    WHERE d.idDisciplina = ?;

                `;
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idDisciplina]);
            if (rows.length > 0) {
                return rows[0]; // retorna apenas o objeto da disciplina encontrada
            } else {
                console.log('Nenhuma disciplina encontrada com o ID:', this._idDisciplina);
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler disciplina pelo ID:', error.message);
            return null;
        }
    }
    
    // Getters e Setters

    get idDisciplina() {
        return this._idDisciplina;
    }

    set idDisciplina(id) {
        this._idDisciplina = id;
    }

    get idTurma() {
        return this._idTurma;
    }

    set idTurma(id) {
        this._idTurma = id;
    }

    get nome() {
        return this._nome;
    }

    set nome(nome) {
        this._nome = nome;
    }
}

// Exporta a classe Disciplina para uso em outros módulos.
module.exports = Disciplina;
