const Turma = require('../model/Turma');

module.exports = class TurmaMiddleware {
    validar_descricaoTurma(request, response, next) {
   
        const descricaoTurma = request.body.turma.descricao;

        if (descricaoTurma !== '0' && descricaoTurma !== '1' ) {
            const objResposta = {
                status: false,
                msg: "A descriçao deve ser apenas 1 (ativa) ou 0 (não ativa)"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    }     
}