const Banco = require('../database/Banco');

class AtividadeEntregue {
    constructor() {
        this._idAtividadeEntregue = null;
        this._matriculaAluno = null;
        this._idAtividade = null;
        this._dataEntrega = null;
        this._caminhoGravacao = '';
        this._nota = null;
    }

    async create() {
        if (await this.verificaEntrega()) {
            console.error('Este aluno já entregou esta atividade.');
            return false;
        }

        const conexao = await Banco.getConexao();
        const SQL = `
            INSERT INTO atividadeentregue
            (matriculaAluno, idAtividade, dataEntrega, caminhoGravacao, nota)
            VALUES (?, ?, ?, ?, ?);
        `;

        try {
            if (!(await this.verificaAlunoExiste()) || !(await this.verificaAtividadeExiste())) {
                console.error('ID de aluno ou atividade inválido.');
                return false;
            }

            const [result] = await conexao.execute(SQL, [
                this._matriculaAluno,
                this._idAtividade,
                this._dataEntrega,
                this._caminhoGravacao,
                this._nota
            ]);

            this._idAtividadeEntregue = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar atividade entregue:', error.message);
            return false;
        }
    }

    async update() {
        const conexao = await Banco.getConexao();
        const SQL = `
            UPDATE atividadeentregue SET
                matriculaAluno = ?,
                idAtividade = ?,
                dataEntrega = ?,
                caminhoGravacao = ?,
                nota = ?
            WHERE idAtividadeEntregue = ?;
        `;

        try {
            if (!(await this.verificaAlunoExiste()) || !(await this.verificaAtividadeExiste())) {
                console.error('ID de aluno ou atividade inválido.');
                return false;
            }

            const [result] = await conexao.execute(SQL, [
                this._matriculaAluno,
                this._idAtividade,
                this._dataEntrega,
                this._caminhoGravacao,
                this._nota,
                this._idAtividadeEntregue
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar entrega:', error.message);
            return false;
        }
    }

    async delete() {
        const conexao = await Banco.getConexao();
        const SQL = 'DELETE FROM atividadeentregue WHERE idAtividadeEntregue = ?;';

        try {
            const [result] = await conexao.execute(SQL, [this._idAtividadeEntregue]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao deletar entrega:', error.message);
            return false;
        }
    }

    async readAll() {
        const conexao = await Banco.getConexao();
        const SQL = `
                    SELECT 
                        ae.idAtividadeEntregue,
                        ae.matriculaAluno,
                        ae.idAtividade,
                        ae.dataEntrega,
                        ae.caminhoGravacao
                    FROM atividadeentregue ae
                    ORDER BY ae.dataEntrega DESC;

                `;

        try {
            const [rows] = await conexao.execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao listar entregas:', error.message);
            return [];
        }
    }

    async readByID() {
        const conexao = await Banco.getConexao();
        const SQL = `
            SELECT 
                ae.idAtividadeEntregue,
                ae.matriculaAluno,
                ae.idAtividade,
                ae.dataEntrega,
                ae.caminhoGravacao,
                ae.nota
            FROM atividadeentregue ae
            WHERE ae.idAtividadeEntregue = ?;
    `;

        try {
            const [rows] = await conexao.execute(SQL, [this._idAtividadeEntregue]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar entrega por ID:', error.message);
            return null;
        }
    }

    async verificaEntrega() {
        const conexao = await Banco.getConexao();
        const SQL = `
            SELECT COUNT(*) AS qtd
            FROM atividadeentregue
            WHERE matriculaAluno = ? AND idAtividade = ?;
        `;

        try {
            const [rows] = await conexao.execute(SQL, [this._matriculaAluno, this._idAtividade]);
            return rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar entrega existente:', error.message);
            return false;
        }
    }

    async listarAtividadesEntreguesporId(){
        const conexao = await Banco.getConexao();
        const SQL = `
            SELECT * FROM atividadeentregue 
            WHERE idAtividade = ?;
        `

        try{
            const [rows] = await conexao.execute(SQL, [this._idAtividade]);
            return rows
        }catch(error){
            console.error('Erro ao listar atividades entrgues de uma atividade', error.message);
            return false
        }
    }

    async verificaAlunoExiste() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM aluno WHERE matricula = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._matriculaAluno]);
            return rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar aluno:', error.message);
            return false;
        }
    }

    async verificaAtividadeExiste() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM atividade WHERE idAtividade = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._idAtividade]);
            return rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar atividade:', error.message);
            return false;
        }
    }

    get idAtividadeEntregue() { 
        return this._idAtividadeEntregue;
     }

    set idAtividadeEntregue(valor) { 
        this._idAtividadeEntregue = valor;
     }

    get matriculaAluno() { 
        return this._matriculaAluno; 
    }

    set matriculaAluno(valor) { 
        this._matriculaAluno = valor; 
    }

    get idAtividade() { 
        return this._idAtividade; 
    }

    set idAtividade(valor) {
         this._idAtividade = valor; 
    }

    get dataEntrega() { 
        return this._dataEntrega; 
    }

    set dataEntrega(valor) { 
        this._dataEntrega = valor; 
    }

    get caminhoGravacao() { 
        return this._caminhoGravacao; 
    }

    set caminhoGravacao(valor) { 
        this._caminhoGravacao = valor; 
    }
    get nota() { 
        return this._nota; 
    }

    set nota(valor) { 
        this._nota = valor; 
    }
}

module.exports = AtividadeEntregue;
