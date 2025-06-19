const AtividadeEntrgue = require('../model/AtividadeEntregue');

module.exports = class AtividadeEntregueMiddleware {
    validar_idAtividade(request, response, next) {

        console.log(request.body)

        const idAtividade = request.params.idAtividadeEntregue;

        
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
}