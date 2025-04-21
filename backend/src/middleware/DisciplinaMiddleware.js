const Disciplina = require('../model/Disciplina');

module.exports = class DisciplinaMiddleware {
    validar_nomeDisciplina(request, response, next) {
   
        const nomeDisciplina = request.body.disciplina.nome;

        if (String(nomeDisciplina).length < 3) {
            const objResposta = {
                status: false,
                msg: "O nome deve ter pelo menos 3 caracteres"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
}