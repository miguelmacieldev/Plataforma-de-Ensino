const jwt = require('jsonwebtoken');
const Admin = require('../model/Admin');
const Professor = require('../model/Professor');
const Aluno = require('../model/Aluno');
const config = require('../config');

class LoginControl {
    async autenticarUsuario(req, res) {
        try {
            const admin = new Admin();
            admin.email = req.body.email;
            admin.senha = req.body.senha;
            const isAdmin = await admin.verificarUsuarioSenha();
            
            if (isAdmin) {
                const token = this._gerarToken({
                    email: admin.email,
                    role: 'admin',
                    name: admin.nome,
                    id: admin.idAdmin
                });
                
                return res.json({
                    status: true,
                    msg: 'Login efetuado com sucesso',
                    token,
                    role: 'admin'
                });
            }

            const professor = new Professor();
            professor.email = req.body.email;
            professor.senha = req.body.senha;
            const isProfessor = await professor.verificarUsuarioSenha();
            
            if (isProfessor) {
                const token = this._gerarToken({
                    email: professor.email,
                    role: 'professor',
                    name: professor.nome,
                    id: professor.idProfessor
                });
                
                return res.json({
                    status: true,
                    msg: 'Login efetuado com sucesso',
                    token,
                    role: 'professor'
                });
            }

            const aluno = new Aluno();
            aluno.email = req.body.email;
            aluno.senha = req.body.senha;
            const isAluno = await aluno.verificarUsuarioSenha();
            
            if (isAluno) {
                const token = this._gerarToken({
                    email: aluno.email,
                    role: 'aluno',
                    name: aluno.nome,
                    id: aluno.matricula
                });
                
                return res.json({
                    status: true,
                    msg: 'Login efetuado com sucesso',
                    token,
                    role: 'aluno'
                });
            }

            // Se nenhum tipo de usuário foi autenticado
            return res.status(401).json({
                status: false,
                msg: 'Credenciais inválidas'
            });

        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({
                status: false,
                msg: 'Erro interno no servidor'
            });
        }
    }

    _gerarToken(claims) {
        return jwt.sign(claims, config.jwtSecret, {
            expiresIn: config.jwtExpiration
        });
    }
}

module.exports = LoginControl;