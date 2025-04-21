const express = require('express');

const AlunoControl = require('../controller/AlunoControl');

const AlunoMiddleware = require('../middleware/AlunoMiddleware');

module.exports = class AlunoRouter {

    constructor() {
        this._router = express.Router();

        this._alunoControl = new AlunoControl();

        this._alunoMiddleware = new AlunoMiddleware();
    }

    criarRotasAluno() {
        this._router.get('/',  this._alunoControl.aluno_read_all_control);
 
        this._router.get('/:matricula', this._alunoControl.aluno_read_by_id_control);
 
        this._router.post('/', this._alunoMiddleware.validar_nomeAluno, this._alunoMiddleware.validar_matriculaAluno,  this._alunoMiddleware.validar_idTurmasAluno, this._alunoControl.aluno_create_control);

        this._router.delete('/:matricula', this._alunoControl.aluno_delete_control);

        this._router.put('/:matricula',  this._alunoControl.aluno_update_control);

        return this._router;
    }
}