const Banco = require('../database/Banco');

class Disciplina {

    constructor() {
        this._idDisciplina = null; 
        this._idTurma = null;      
        this._nome = '';           
    }

    async create() {
        const conexao = await Banco.getConexao();
        const SQL = 'INSERT INTO disciplina (idTurma, nome) VALUES (?, ?);';
        try {
            if (!(await this.isTurmaValida())) {
                console.error('Turma não encontrada para o idTurma informado.');
                return false;
            }

            if (await this.isDisciplina()) {
                return false;
            }

            const [result] = await conexao.execute(SQL, [this._idTurma, this._nome]);
            this._idDisciplina = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar a disciplina:', error.message);
            return false;
        }
    }

    async delete() {
        const conexao = await Banco.getConexao();
        const SQL = 'DELETE FROM disciplina WHERE idDisciplina = ?;';
        try {
            const [result] = await conexao.execute(SQL, [this._idDisciplina]);
            return result.affectedRows > 0;
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return false
            };

            return false;
        }
    }

    async update() {
        const conexao = await Banco.getConexao();
        const SQL = 'UPDATE disciplina SET idTurma = ?, nome = ? WHERE idDisciplina = ?;';
        try {
            if (!(await this.isTurmaValida())) {
                console.error('Turma não encontrada para o idTurma informado.');
                return false;
            }

            if (await this.isDisciplina()){
                return false;
            }
            const [result] = await conexao.execute(SQL, [this._idTurma, this._nome, this._idDisciplina]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar a disciplina:', error.message);
            return false;
        }
    }


    async buscarPorTurma(idTurma) {
        const conexao = await Banco.getConexao();
        const SQL = ` SELECT 
                        d.idDisciplina,
                        d.nome AS nomeDisciplina,
                        d.idTurma,
                        p.nome AS nomeProfessor,
                        p.idProfessor AS idProfessor
                        FROM plataforma_de_estudos.disciplina d
                        JOIN plataforma_de_estudos.disciplinaprofessor dp ON d.idDisciplina = dp.idDisciplina
                        JOIN plataforma_de_estudos.professor p ON dp.idProfessor = p.idProfessor
                        WHERE d.idTurma = ?;
                    `;
      
        try {
            const [rows] = await conexao.execute(SQL, [idTurma]);
            return rows
        } catch (error) {
            console.error('Erro ao verificar a disciplina:', error.message);
            return false;
        }
    }


    async isDisciplina() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM disciplina WHERE nome = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._nome]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar a disciplina:', error.message);
            return false;
        }
    }

    async isTurmaValida() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM turma WHERE idTurma = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._idTurma]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar a existência da turma:', error.message);
            return false;
        }
    }

    async readAll() {
        const conexao = await Banco.getConexao();
        const SQL = `
                    SELECT 
                        d.idDisciplina,
                        d.nome,
                        d.idTurma
                    FROM disciplina d
                    ORDER BY d.nome;

                `;
        try {
            const [rows] = await conexao.execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler disciplinas:', error.message);
            return [];
        }
    }

    async readByID() {
        const conexao = await Banco.getConexao();
        const SQL = `
                    SELECT 
                        d.idDisciplina,
                        d.nome,
                        d.idTurma
                    FROM disciplina d
                    WHERE d.idDisciplina = ?;

                `;
        try {
            const [rows] = await conexao.execute(SQL, [this._idDisciplina]);
            if (rows.length > 0) {
                return rows[0]; // retorna apenas o objeto da disciplina encontrada
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler disciplina pelo ID:', error.message);
            return null;
        }
    }
    

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

module.exports = Disciplina;
