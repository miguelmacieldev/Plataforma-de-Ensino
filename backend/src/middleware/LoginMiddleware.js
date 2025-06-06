class LoginMiddleware {
    validar_emailLogin(req, res, next) {
        const { email } = req.body;
        
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({
                status: false,
                msg: 'Email inválido'
            });
        }
        
        next();
    }

    validar_senhaLogin(req, res, next) {
        const { senha } = req.body;
        
        if (!senha || typeof senha !== 'string' || senha.length < 3) {
            return res.status(400).json({
                status: false,
                msg: 'Senha inválida (mínimo 3 caracteres)'
            });
        }
        
        next();
    }
}

module.exports = LoginMiddleware;