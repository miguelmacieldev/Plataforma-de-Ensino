const Banco = require('../database/Banco');

class Atividade {
    constructor() {
        this._idAtividade = null;
        this._descricao = '';
        this._devolucao = false;
        this._caminhoGravacao = '';
        this._dataPostagem = null;
        this._dataEntrega = null;
        this._idDisciplinaProfessor = null;
    }

    async create() {
        const conexao = Banco.getConexao();
        const SQL = `
            INSERT INTO atividade 
            (descricao, devolucao, caminhoGravacao, dataPostagem, dataEntrega, idDisciplinaProfessor)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        try {
            if (!(await this.verificaDisciplinaProfessorExiste())) {
                console.error('ID de disciplinaProfessor inválido.');
                return false;
            }
    
            const [result] = await conexao.promise().execute(SQL, [
                this._descricao,
                this._devolucao,
                this._caminhoGravacao,
                this._dataPostagem,
                this._dataEntrega,
                this._idDisciplinaProfessor
            ]);
            this._idAtividade = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar atividade:', error.message);
            return false;
        }
    }
    
    async update() {
        const conexao = Banco.getConexao();
        const SQL = `
            UPDATE atividade SET 
                descricao = ?, 
                devolucao = ?, 
                caminhoGravacao = ?, 
                dataPostagem = ?, 
                dataEntrega = ?, 
                idDisciplinaProfessor = ?
            WHERE idAtividade = ?;
        `;
        try {
            if (!(await this.verificaDisciplinaProfessorExiste())) {
                console.error('ID de disciplinaProfessor inválido.');
                return false;
            }
            
            const [result] = await conexao.promise().execute(SQL, [
                this._descricao,
                this._devolucao,
                this._caminhoGravacao,
                this._dataPostagem,
                this._dataEntrega,
                this._idDisciplinaProfessor,
                this._idAtividade
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error.message);
            return false;
        }
    }    

    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM atividade WHERE idAtividade = ?;';
        try {
            const [result] = await conexao.promise().execute(SQL, [this._idAtividade]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir atividade:', error.message);
            return false;
        }
    }

    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = `
                    SELECT 
                        a.idAtividade,
                        a.descricao,
                        a.devolucao,
                        a.caminhoGravacao,
                        a.dataPostagem,
                        a.dataEntrega,
                        a.idDisciplinaProfessor
                    FROM atividade a
                    ORDER BY a.dataPostagem DESC;

                  `;
        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler atividades:', error.message);
            return [];
        }
    }

    async readByID() {
        const conexao = Banco.getConexao();
        const SQL = `
                        SELECT 
                            a.idAtividade,
                            a.descricao,
                            a.devolucao,
                            a.caminhoGravacao,
                            a.dataPostagem,
                            a.dataEntrega,
                            a.idDisciplinaProfessor
                        FROM atividade a
                        WHERE a.idAtividade = ?;

                    `;
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idAtividade]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                console.log('Nenhuma atividade encontrada com o ID:', this._idAtividade);
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler atividade por ID:', error.message);
            return null;
        }
    }

    async verificaDisciplinaProfessorExiste() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM disciplinaprofessor WHERE idDisciplinaProfessor = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idDisciplinaProfessor]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar disciplinaProfessor:', error.message);
            return false;
        }
    }


    get idAtividade() {
        return this._idAtividade;
    }
    set idAtividade(valor) {
        this._idAtividade = valor;
    }

    get descricao() {
        return this._descricao;
    }
    set descricao(valor) {
        this._descricao = valor;
    }

    get devolucao() {
        return this._devolucao;
    }
    set devolucao(valor) {
        this._devolucao = valor;
    }

    get caminhoGravacao() {
        return this._caminhoGravacao;
    }
    set caminhoGravacao(valor) {
        this._caminhoGravacao = valor;
    }

    get dataPostagem() {
        return this._dataPostagem;
    }
    set dataPostagem(valor) {
        this._dataPostagem = valor;
    }

    get dataEntrega() {
        return this._dataEntrega;
    }
    set dataEntrega(valor) {
        this._dataEntrega = valor;
    }

    get idDisciplinaProfessor() {
        return this._idDisciplinaProfessor;
    }
    set idDisciplinaProfessor(valor) {
        this._idDisciplinaProfessor = valor;
    }
}

module.exports = Atividade;
