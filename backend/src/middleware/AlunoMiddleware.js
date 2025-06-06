const Aluno = require('../model/Aluno');

module.exports = class AlunoMiddleware {
    validar_nomeAluno(request, response, next) {
   
        const nomeAluno = request.body.aluno.nome;

        if (nomeAluno < 3) {
            const objResposta = {
                status: false,
                msg: "O nome deve ter pelo menos 3 caracteres"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
    
    validar_senhaAluno(req, res, next) {
        const senha = req.body.aluno.senha;
        
        if (!senha || typeof senha !== 'string' || senha.length < 3) {
            return res.status(400).json({
                status: false,
                msg: 'Senha inválida (mínimo 3 caracteres)'
            });
        }
        
        next();
    }

    validar_matriculaAluno(request, response, next) {
   
        const matriculaAluno = request.body.aluno.matricula;
        console.log(request.body.aluno.matricula); 

        if (String(matriculaAluno).length < 8) {
            
            const objResposta = {
                status: false,
                msg: "A matricula deve ter pelo menos 8 caracteres e ser um número"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
 
    validar_idTurmasAluno(request, response, next) {
        const { idTurmaPrimaria, idTurmaSecundaria } = request.body.aluno;

            const idPrimaria = Number(idTurmaPrimaria);
            const idSecundaria = Number(idTurmaSecundaria);

            if (
                isNaN(idPrimaria) || 
                isNaN(idSecundaria) || 
                idPrimaria === idSecundaria
            ) {
                return response.status(400).json({
                    status: false,
                    msg: "Os IDs das turmas devem ser números diferentes e válidos.",
                });
            }

        next();
    }     
}