const Banco = require('../database/Banco');

class Aluno {
    constructor() {
        this._matricula = '';
        this._nome = '';
        this._telefone = '';
        this._email = '';
        this._idTurmaPrimaria = null;
        this._idTurmaSecundaria = null;
    }

    // Criação de um novo aluno
    async create() {
        const conexao = Banco.getConexao();
        const SQL = 'INSERT INTO aluno (matricula, nome, telefone, email, idTurmaPrimaria, idTurmaSecundaria) VALUES (?, ?, ?, ?, ?, ?);';

        try {
            if (await this.isAluno()) {
                console.error('Aluno já existe.');
                return false;
            }

            if (!(await this.verificaTurmasExistem())) {
                console.error('Turma primária ou secundária inválida.');
                return false;
            }

            const [result] = await conexao.promise().execute(SQL, [
                this._matricula,
                this._nome,
                this._telefone,
                this._email,
                this._idTurmaPrimaria,
                this._idTurmaSecundaria
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar o aluno:', error.message);
            return false;
        }
    }

    // Atualização de aluno existente
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE aluno SET nome = ?, telefone = ?, email = ?, idTurmaPrimaria = ?, idTurmaSecundaria = ? WHERE matricula = ?;';

        try {
            if (!(await this.verificaTurmasExistem()) || await this.isAluno()) {
                return false;
            }

            const [result] = await conexao.promise().execute(SQL, [
                this._nome,
                this._telefone,
                this._email,
                this._idTurmaPrimaria,
                this._idTurmaSecundaria,
                this._matricula
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o aluno:', error.message);
            return false;
        }
    }

    // Excluir aluno
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM aluno WHERE matricula = ?;';
        try {
            const [result] = await conexao.promise().execute(SQL, [this._matricula]);
            return [result.affectedRows > 0];
        } catch (error) {
            console.error('Erro ao excluir o aluno:', error.message);
            return false;
        }
    }

    // Verifica se o aluno já existe pela matrícula
    async isAluno() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM aluno WHERE matricula = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._matricula]);
            return rows.length > 0 && rows[0].qtd > 0;
        } catch (error) {
            console.error('Erro ao verificar aluno:', error.message);
            return false;
        }
    }

    // Verifica se as duas turmas informadas existem
    async verificaTurmasExistem() {
        const conexao = Banco.getConexao();
    
        // Converte para número e valida
        const turmaPrimaria = parseInt(this._idTurmaPrimaria);
        const turmaSecundaria = parseInt(this._idTurmaSecundaria);
    
        if (isNaN(turmaPrimaria) || isNaN(turmaSecundaria)) {
            console.warn('IDs de turma inválidos:', this._idTurmaPrimaria, this._idTurmaSecundaria);
            return false;
        }
    
        const SQL = 'SELECT idTurma FROM turma WHERE idTurma IN (?, ?);';
    
        try {
            const [rows] = await conexao.promise().execute(SQL, [turmaPrimaria, turmaSecundaria]);
            const turmasEncontradas = rows.map(row => row.idTurma);
            return turmasEncontradas.includes(turmaPrimaria) &&
                   turmasEncontradas.includes(turmaSecundaria);
        } catch (error) {
            console.error('Erro ao verificar turmas:', error.message);
            return false;
        }
    }
    
    
    // Leitura de todos os alunos
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = `
                        SELECT 
                            a.matricula,
                            a.nome,
                            a.telefone,
                            a.email,
                            a.idTurmaPrimaria,
                            a.idTurmaSecundaria
                        FROM aluno a
                        ORDER BY a.nome;
                    `;
        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler alunos:', error.message);
            return [];
        }
    }
    

    // Leitura de aluno por matrícula
    async readByID() {
        const conexao = Banco.getConexao();
        const SQL = `
                       SELECT 
                        a.matricula,
                        a.nome,
                        a.telefone,
                        a.email,
                        a.idTurmaPrimaria,
                        a.idTurmaSecundaria
                    FROM aluno a
                    WHERE a.matricula = ?;
                     `;
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._matricula]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                console.log('Nenhum aluno encontrado com a matrícula:', this._matricula);
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler aluno por matrícula:', error.message);
            return null;
        }
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
}

module.exports = Aluno;
