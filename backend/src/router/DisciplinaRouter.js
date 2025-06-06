const multer = require('multer');

const path = require('path');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const express = require('express');

const DisciplinaControl = require('../controller/DisciplinaControl');

const DisciplinaMiddleware = require('../middleware/DisciplinaMiddleware');

module.exports = class DisciplinaRouter {

    constructor() {
        this._router = express.Router();

        this._disciplinaControl = new DisciplinaControl();

        this._authMiddleware = new AuthMiddleware();

        this._disciplinaMiddleware = new DisciplinaMiddleware();

        this._upload = multer({ dest: 'uploads/' });
    }

    criarRotasDisciplina() {
        this._router.get('/', this._authMiddleware.autenticarToken,this._disciplinaControl.disciplina_read_all_control);
        
        this._router.get('/turmas/:idTurma', this._authMiddleware.autenticarToken,this._disciplinaControl.disciplina_read_disciplina_turma);
 
        this._router.get('/:idDisciplina', this._authMiddleware.autenticarToken,this._disciplinaControl.disciplina_read_by_id_control);
 
        this._router.post('/', this._authMiddleware.autenticarToken,this._disciplinaMiddleware.validar_nomeDisciplina, this._disciplinaControl.disciplina_create_control);

        this._router.delete('/:idDisciplina', this._authMiddleware.autenticarToken,this._disciplinaControl.disciplina_delete_control);

        this._router.put('/:idDisciplina', this._authMiddleware.autenticarToken, this._disciplinaMiddleware.validar_nomeDisciplina,this._disciplinaControl.disciplina_update_control);

        this._router.post('/upload-csv', this._authMiddleware.autenticarToken,this._upload.single('arquivo'), this._disciplinaControl.disciplina_upload_csv_control);


        return this._router;
    }
}