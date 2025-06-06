const Banco = require('../database/Banco');
const {compararSenha, gerarHashSenha} = require('../utils/criptografia')

class Aluno {
    constructor() {
        this._matricula = '';
        this._nome = '';
        this._senha = '';
        this._telefone = '';
        this._email = '';
        this._idTurmaPrimaria = null;
        this._idTurmaSecundaria = null;
    }

    // Criação de um novo aluno
    async create() {
        const conexao = await Banco.getConexao();
        const SQL = 'INSERT INTO aluno (matricula, nome, telefone, email, idTurmaPrimaria, idTurmaSecundaria, senha) VALUES (?, ?, ?, ?, ?, ?, ?);';

        try {
            if (await this.isAluno()) {
                return false;
            }

            if (!(await this.verificaTurmasExistem())) {
                return false;
            }

            const senhaHash = await gerarHashSenha(this._senha);

            const [result] = await conexao.execute(SQL, [
                this._matricula,
                this._nome,
                this._telefone,
                this._email,
                this._idTurmaPrimaria,
                this._idTurmaSecundaria,
                senhaHash
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar o aluno:', error.message);
            return false;
        }
    }

    async update() {
        const conexao = await Banco.getConexao();
        const SQL = 'UPDATE aluno SET nome = ?, telefone = ?, email = ?, idTurmaPrimaria = ?, idTurmaSecundaria = ?, senha = ? WHERE matricula = ?;';

        try {
            if (!(await this.verificaTurmasExistem()) || !(await this.isAluno())) {
                return false;
            }

            const senhaHash = await gerarHashSenha(this._senha);

            const [result] = await conexao.execute(SQL, [
                this._nome,
                this._telefone,
                this._email,
                this._idTurmaPrimaria,
                this._idTurmaSecundaria,
                senhaHash,
                this._matricula
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }

    // Excluir aluno
    async delete() {
        const conexao = await Banco.getConexao();
        const SQL = 'DELETE FROM aluno WHERE matricula = ?;';
        try {
            const [result] = await conexao.execute(SQL, [this._matricula]);
            return [result.affectedRows > 0];
        } catch (error) {  
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return false
            };
            return false;
        }
    }

    // Verifica se o aluno já existe pela matrícula
    async isAluno() {
        const conexao = await Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM aluno WHERE matricula = ?;';
        try {
            const [rows] = await conexao.execute(SQL, [this._matricula]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar aluno:', error.message);
            return false;
        }
    }

    // Verifica se as duas turmas informadas existem
    async verificaTurmasExistem() {
        const conexao = await Banco.getConexao();
    
        // Converte para número e valida
        const turmaPrimaria = parseInt(this._idTurmaPrimaria);
        const turmaSecundaria = parseInt(this._idTurmaSecundaria);
    
        if (isNaN(turmaPrimaria) || isNaN(turmaSecundaria)) {
            console.warn('IDs de turma inválidos:', this._idTurmaPrimaria, this._idTurmaSecundaria);
            return false;
        }
    
        const SQL = 'SELECT idTurma FROM turma WHERE idTurma IN (?, ?);';
    
        try {
            const [rows] = await conexao.execute(SQL, [turmaPrimaria, turmaSecundaria]);
            const turmasEncontradas = rows.map(row => row.idTurma);
            return turmasEncontradas.includes(turmaPrimaria) &&
                   turmasEncontradas.includes(turmaSecundaria);
        } catch (error) {
            return false;
        }
    }
    
    
    // Leitura de todos os alunos
    async readAll() {
        const conexao = await Banco.getConexao();
        const SQL = `
                        SELECT 
                            a.matricula,
                            a.nome,
                            a.telefone,
                            a.email,
                            a.idTurmaPrimaria,
                            a.idTurmaSecundaria,
                            a.senha
                        FROM aluno a
                        ORDER BY a.nome;
                    `;
        try {
            const [rows] = await conexao.execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler alunos:', error.message);
            return [];
        }
    }
    

    // Leitura de aluno por matrícula
    async readByID() {
        const conexao = await Banco.getConexao();
        const SQL = `
                       SELECT 
                        a.matricula,
                        a.nome,
                        a.telefone,
                        a.email,
                        a.idTurmaPrimaria,
                        a.idTurmaSecundaria,
                        a.senha
                    FROM aluno a
                    WHERE a.matricula = ?;
                     `;
        try {
            const [rows] = await conexao.execute(SQL, [this._matricula]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler aluno por matrícula:', error.message);
            return null;
        }
    }

    async verificarUsuarioSenha() {
        const conexao = await Banco.getConexao();
        const sql = 'SELECT * FROM aluno WHERE email = ?';
        const [rows] = await conexao.execute(sql, [this.email]);

        if (rows.length === 0){
            return false;
        }

        const aluno = rows[0];

        const senhaCorreta = await compararSenha(this.senha, aluno.senha);
        if (!senhaCorreta){
            return false;
        }

        this.matricula = aluno.matricula;
        this.email = aluno.email
        this.nome = aluno.nome;
        this.telefone = aluno.telefone;
        this.idTurmaPrimaria = aluno.idTurmaPrimaria;
        this.idTurmaSecundaria = aluno.idTurmaSecundaria;

        
        return true;
    }

    // Getters e Setters
    get matricula() {
        return this._matricula;
    }

    set matricula(valor) {
        this._matricula = valor;
    }

    get nome() {
        return this._nome;
    }

    set nome(valor) {
        this._nome = valor;
    }

    get telefone() {
        return this._telefone;
    }

    set telefone(valor) {
        this._telefone = valor;
    }

    get email() {
        return this._email;
    }

    set email(valor) {
        this._email = valor;
    }

    get idTurmaPrimaria() {
        return this._idTurmaPrimaria;
    }

    set idTurmaPrimaria(valor) {
        this._idTurmaPrimaria = valor;
    }

    get idTurmaSecundaria() {
        return this._idTurmaSecundaria;
    }

    set idTurmaSecundaria(valor) {
        this._idTurmaSecundaria = valor;
    }
    
    get senha() {
        return this._senha;
    }

    set senha(valor) {
        this._senha = valor;
    }
}

module.exports = Aluno;
