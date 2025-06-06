const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = class AtividadeMiddleware {
        autenticarToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ msg: 'Token não fornecido' });

        jwt.verify(token, config.jwtSecret, (err, usuario) => {
        if (err) return res.status(403).json({ msg: 'Token inválido' });

            req.usuario = usuario;
                next();
            });
        }

        permitirTipos(...tiposPermitidos) {
            return (req, res, next) => {
 
                if (!tiposPermitidos.includes(req.usuario.role)) {
                    return res.status(403).json({ status: false, msg: "Acesso não permitido para este tipo de usuário." });
                }
                next();
        };
    }

}

