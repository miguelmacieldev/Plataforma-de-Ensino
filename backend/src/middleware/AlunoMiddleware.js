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
    
    validar_matriculaAluno(request, response, next) {
   
        const matriculaAluno = request.body.aluno.matricula;
        console.log(request.body.aluno.matricula); 

        if (String(matriculaAluno).length < 8) {
            
            const objResposta = {
                status: false,
                msg: "O nome deve ter pelo menos 8 caracteres e ser um número"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
 
    validar_idTurmasAluno(request, response, next) {
   
        const idTurmaPrimariaAluno = request.body.aluno.idTurmaPrimaria;
        const idTurmaSecundariaAluno = request.body.aluno.idTurmaSecundaria;

        if (isNaN(Number(idTurmaPrimariaAluno)) || isNaN(Number(idTurmaSecundariaAluno))) {
            const objResposta = {
                status: false,
                msg: "Os ids das turmas do aluno devem ser números"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
}