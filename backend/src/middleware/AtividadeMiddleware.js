const Atividade = require('../model/Atividade');

module.exports = class AtividadeMiddleware {
    validar_idDisciplinaProfessor(request, response, next) {
   
        const idDisciplinaProfessor = request.body.atividade.idDisciplinaProfessor;

        if (isNaN(Number(idDisciplinaProfessor))) {
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