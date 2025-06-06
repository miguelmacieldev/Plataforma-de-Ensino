const Banco = require('../database/Banco');
const {compararSenha, gerarHashSenha} = require('../utils/criptografia')

class Professor {

    constructor() {
        this._idProfessor = null;   
        this._nome = '';           
        this._telefone = '';
        this._senha = '';          
        this._email = '';
    }

    async create() {
        const conexao = await Banco.getConexao();
        const SQL = 'INSERT INTO professor (nome, telefone, senha, email) VALUES (?, ?, ?, ?);';
        try {
            if (await this.isProfessor()) {
                return false;
            }
            
            const senhaHash = await gerarHashSenha(this._senha);

            const [result] = await conexao.execute(SQL, [this._nome, this._telefone, senhaHash, this._email]);
            this._idProfessor = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }

    async delete() {
        const conexao = await Banco.getConexao();
        const SQL = 'DELETE FROM professor WHERE idProfessor = ?;';
        try {
            const [result] = await conexao.execute(SQL, [this._idProfessor]);
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
        const SQL = 'UPDATE professor SET nome = ?, telefone = ?, senha = ?, email = ? WHERE idProfessor = ?;';
        try {
            const senhaHash = await gerarHashSenha(this._senha);

            const [result] = await conexao.execute(SQL, [this._nome, this._telefone, senhaHash, this._email,this._idProfessor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o professor:', error.message);
            return false;
        }
    }

    async isProfessor() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM professor WHERE nome = ? AND telefone = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._nome, this._telefone]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar o professor:', error.message);
            return false;
        }
    }

    async readAll() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT * FROM professor ORDER BY nome;';
        try {
            const [rows] = await conexao.execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler professores:', error.message);
            return [];
        }
    }

    async readByID() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT * FROM professor WHERE idProfessor = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._idProfessor]);
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

     async buscarPorTurmaDisciplina() {
        const conexao = await Banco.getConexao();
        const SQL = ` SELECT 
                        t.idTurma,
                        t.curso AS nomeTurma,
                        d.idDisciplina,
                        d.nome AS nomeDisciplina
                        FROM plataforma_de_estudos.disciplinaprofessor dp
                        JOIN plataforma_de_estudos.disciplina d ON dp.idDisciplina = d.idDisciplina
                        JOIN plataforma_de_estudos.turma t ON d.idTurma = t.idTurma
                        WHERE dp.idProfessor = ?;
                    `;
      
        try {
            const [rows] = await conexao.execute(SQL, [this._idProfessor]);
            return rows
        } catch (error) {
            console.error('Erro ao verificar a disciplina:', error.message);
            return false;
        }
    }

    
    async verificarUsuarioSenha() {        
        const conexao = await Banco.getConexao();
        const sql = 'SELECT * FROM professor WHERE email = ?';
        const [rows] = await conexao.execute(sql, [this.email]);

        if (rows.length === 0) {
            return false;
        }

        const professor = rows[0];

        const senhaCorreta = await compararSenha(this.senha, professor.senha);
        if (!senhaCorreta) {
            console.log('Senha incorreta');
            return false;
        }

        this.idProfessor = professor.idProfessor;
        this.email = professor.email;
        this.nome = professor.nome;
        this.telefone = professor.telefone;

        return true;
    }


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

    get email() {
        return this._email;
    }

    set email(email) {
        this._email = email;
    }
}

module.exports = Professor;
