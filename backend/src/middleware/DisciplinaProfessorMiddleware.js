const DisciplinaProfessor = require('../model/DisciplinaProfessor');

module.exports = class DisciplinaProfessorMiddleware {
    validar_idDisciplinaProfessor(request, response, next) {
   
        const idDisciplina = request.body.disciplinaprofessor.idDisciplina;
        const idProfessor = request.body.disciplinaprofessor.idProfessor;

        if (isNaN(Number(idDisciplina)) || isNaN(Number(idProfessor))) {
            const objResposta = {
                status: false,
                msg: "Os ids devem ser números"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
}