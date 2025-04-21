const AtividadeEntrgue = require('../model/AtividadeEntregue');

module.exports = class AtividadeEntregueMiddleware {
    validar_idAtividade(request, response, next) {
   
        const idAtividade = request.body.atividadeentregue.idAtividade;

        if (isNaN(Number(idAtividade))) {
            const objResposta = {
                status: false,
                msg: "O id deve ser um número"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     

    validar_matriculaAluno(request, response, next) {
   
        const matriculaAluno = request.body.atividadeentregue.matriculaAluno;

        if (isNaN(Number(matriculaAluno))) {
            
            const objResposta = {
                status: false, 
                msg: "O id deve ser um número"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
}