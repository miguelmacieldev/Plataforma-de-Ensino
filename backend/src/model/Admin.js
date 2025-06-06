const Banco = require('../database/Banco');
const {compararSenha, gerarHashSenha} = require('../utils/criptografia')

class Admin{
    constructor() {
        this._idAdmin = null;
        this._email = '';
        this._nome = '';
        this._senha = '';
    }


    async verificarUsuarioSenha() {
        const conexao = await Banco.getConexao();
        const sql = 'SELECT * FROM admin WHERE email = ?';
        const [rows] = await conexao.execute(sql, [this.email]);

        if (rows.length === 0){
            return false;
        }

        const admin = rows[0];

        const senhaCorreta = await compararSenha(this.senha, admin.senha);
        if (!senhaCorreta){
            return false;
        }

        this.email = admin.email
        this.idAdmin = admin.idAdmin;
        this.nome = admin.nome;
        
        return true;
    }

    // Getters e Setters
    get email() {
        return this._email;
    }

    set email(valor) {
        this._email = valor;
    }
    
    get idAdmin() {
        return this._idAdmin;
    }

    set idAdmin(valor) {
        this._idAdmin = valor;
    }
    
    get nome() {
        return this._nome;
    }

    set nome(valor) {
        this._nome = valor;
    }

    get senha() {
        return this._senha;
    }

    set senha(valor) {
        this._senha = valor;
    }
}

module.exports = Admin;
