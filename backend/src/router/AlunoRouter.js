const multer = require('multer');

const path = require('path');

const express = require('express');

const AlunoControl = require('../controller/AlunoControl');

const AlunoMiddleware = require('../middleware/AlunoMiddleware');

const AuthMiddleware = require('../middleware/AuthMiddleware');

module.exports = class AlunoRouter {

    constructor() {
        this._router = express.Router();

        this._alunoControl = new AlunoControl();

        this._authMiddleware = new AuthMiddleware();        

        this._alunoMiddleware = new AlunoMiddleware();

        this._upload = multer({ dest: 'uploads/' });
    }

    criarRotasAluno() {
        this._router.get('/', this._authMiddleware.autenticarToken, this._alunoControl.aluno_read_all_control);
 
        this._router.get('/:matricula', this._authMiddleware.autenticarToken, this._alunoControl.aluno_read_by_id_control);
 
        this._router.post('/', this._authMiddleware.autenticarToken, this._alunoMiddleware.validar_nomeAluno, this._alunoMiddleware.validar_matriculaAluno,  this._alunoMiddleware.validar_idTurmasAluno, this._alunoMiddleware.validar_senhaAluno,this._alunoControl.aluno_create_control);

        this._router.delete('/:matricula', this._authMiddleware.autenticarToken, this._alunoControl.aluno_delete_control);

        this._router.put('/:matricula',  this._authMiddleware.autenticarToken, this._alunoMiddleware.validar_nomeAluno, this._alunoMiddleware.validar_matriculaAluno,  this._alunoMiddleware.validar_idTurmasAluno, this._alunoMiddleware.validar_senhaAluno,this._alunoControl.aluno_update_control);

        this._router.post('/upload-csv', this._authMiddleware.autenticarToken, this._upload.single('arquivo'), this._alunoControl.aluno_upload_csv_control);

        return this._router;
    }
}