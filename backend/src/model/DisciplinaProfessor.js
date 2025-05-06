const Banco = require('../database/Banco');

class DisciplinaProfessor {
    constructor() {
        this._idDisciplinaProfessor = null;
        this._idProfessor = null;
        this._idDisciplina = null;
    }

    async create() {
        const conexao = Banco.getConexao();
        
        const vinculoExistente = await this.vinculoExiste();
        if (vinculoExistente) {
            return false; 
        }
    
        const professorValido = await this.professorExiste();
        const disciplinaValida = await this.disciplinaExiste();
    
        if (!professorValido || !disciplinaValida) {
            return false;
        }
    
        const SQL = 'INSERT INTO disciplinaprofessor (idProfessor, idDisciplina) VALUES (?, ?);';
        const [result] = await conexao.promise().execute(SQL, [this._idProfessor, this._idDisciplina]);
        this._idDisciplinaProfessor = result.insertId;
        return result.affectedRows > 0;
    }

    async vinculoExiste() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM disciplinaprofessor WHERE idProfessor = ? AND idDisciplina = ?;';
        const [rows] = await conexao.promise().execute(SQL, [this._idProfessor, this._idDisciplina]);
        return rows[0].qtd > 0;
    }

    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM disciplinaprofessor WHERE idDisciplinaProfessor = ?;';
        const [result] = await conexao.promise().execute(SQL, [this._idDisciplinaProfessor]);
        return result.affectedRows > 0;
    }

    async readByID() {
        const conexao = Banco.getConexao();
        const SQL = `
                        SELECT 
                            dp.idDisciplinaProfessor,
                            dp.idProfessor,
                            dp.idDisciplina
                        FROM disciplinaprofessor dp
                        WHERE dp.idDisciplinaProfessor = ?;

                    `;
        const [rows] = await conexao.promise().execute(SQL, [this._idDisciplinaProfessor]);
        return rows[0] || null;
    }

    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = `
                        SELECT 
                            dp.idDisciplinaProfessor,
                            dp.idProfessor,
                            dp.idDisciplina
                        FROM disciplinaprofessor dp;

                    `;
        const [rows] = await conexao.promise().execute(SQL);
        return rows;
    }

    async update() {
        const conexao = Banco.getConexao();
        const professorValido = await this.professorExiste();
        const disciplinaValida = await this.disciplinaExiste();

        if (!professorValido || !disciplinaValida) {
            return false;
        }

        const existeDuplicado = await this.vinculoDuplicado();
        if (existeDuplicado) {
            return false;
        }

        const SQL = `
            UPDATE disciplinaprofessor 
            SET idProfessor = ?, idDisciplina = ? 
            WHERE idDisciplinaProfessor = ?;
        `;
        const [result] = await conexao.promise().execute(SQL, [
            this._idProfessor,
            this._idDisciplina,
            this._idDisciplinaProfessor
        ]);
        return result.affectedRows > 0;
    }

    async vinculoDuplicado() {
        const conexao = Banco.getConexao();
        const SQL = `
            SELECT * FROM disciplinaprofessor 
            WHERE idProfessor = ? AND idDisciplina = ? AND idDisciplinaProfessor != ?;
        `;
        const [result] = await conexao.promise().execute(SQL, [
            this._idProfessor,
            this._idDisciplina,
            this._idDisciplinaProfessor
        ]);
    
        return result.length > 0;
    }

    async professorExiste() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM professor WHERE idProfessor = ?;';
        const [rows] = await conexao.promise().execute(SQL, [this._idProfessor]);
        return rows[0].qtd > 0;
    }

    async disciplinaExiste() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM disciplina WHERE idDisciplina = ?;';
        const [rows] = await conexao.promise().execute(SQL, [this._idDisciplina]);
        return rows[0].qtd > 0;
    }

    get idDisciplinaProfessor() {
        return this._idDisciplinaProfessor;
    }

    set idDisciplinaProfessor(value) {
        this._idDisciplinaProfessor = value;
    }

    get idProfessor() {
        return this._idProfessor;
    }

    set idProfessor(value) {
        this._idProfessor = value;
    }

    get idDisciplina() {
        return this._idDisciplina;
    }

    set idDisciplina(value) {
        this._idDisciplina = value;
    }
}

module.exports = DisciplinaProfessor;
