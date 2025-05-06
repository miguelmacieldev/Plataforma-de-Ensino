const DisciplinaProfessor = require('../model/DisciplinaProfessor');

module.exports = class DisciplinaProfessorMiddleware {
    validar_idDisciplinaProfessor(request, response, next) {
        const { disciplinaprofessor } = request.body;

        if (!disciplinaprofessor || !disciplinaprofessor.idDisciplina || !disciplinaprofessor.idProfessor) {
            return response.status(400).send({
                status: false,
                msg: "O corpo da requisição deve conter disciplinaprofessor com idDisciplina e idProfessor"
            });
        }

        const { idDisciplina, idProfessor } = disciplinaprofessor;

        if (isNaN(Number(idDisciplina)) || isNaN(Number(idProfessor))) {
            return response.status(400).send({
                status: false,
                msg: "Os ids devem ser números"
            });
        }

        next();
    }     
}
