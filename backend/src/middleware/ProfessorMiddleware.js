const Professor = require('../model/Professor');

module.exports = class ProfessorMiddleware {
    validar_nomeProfessor(request, response, next) {
   
        const nomeProfessor = request.body.professor.nome;

        if (String(nomeProfessor).length < 3) {
            const objResposta = {
                status: false,
                msg: "O nome deve ter pelo menos 3 caracteres"
            }

            response.status(200).send(objResposta);
        } else {
            next(); 
        }
    } 
    
        validar_senhaProfessor(req, res, next) {
        const senha = req.body.professor.senha;
        
        if (!senha || typeof senha !== 'string' || senha.length < 3) {
            return res.status(400).json({
                status: false,
                msg: 'Senha inválida (mínimo 3 caracteres)'
            });
        }
        
        next();
    }
}