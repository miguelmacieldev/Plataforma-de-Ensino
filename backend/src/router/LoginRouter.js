const express = require('express');
const LoginControl = require('../controller/LoginControl');
const LoginMiddleware = require('../middleware/LoginMiddleware');

module.exports = class LoginRouter {
    constructor() {
        this._router = express.Router();
        this._loginControl = new LoginControl();
        this._loginMiddleware = new LoginMiddleware();
    }

    criarRotasLogin() {
        console.log('po')
        this._router.post('/',
                    this._loginMiddleware.validar_emailLogin,
                    this._loginMiddleware.validar_senhaLogin,
                    (req, res) => this._loginControl.autenticarUsuario(req, res)
                );
        return this._router;
    }
}