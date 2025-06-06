const multer = require('multer');

const path = require('path');

const express = require('express');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const ProfessorControl = require('../controller/ProfessorControl');

const ProfessorMiddleware = require('../middleware/ProfessorMiddleware');

module.exports = class ProfessorRouter {

    constructor() {
        this._router = express.Router();

        this._professorControl = new ProfessorControl();

        this._professorMiddleware = new ProfessorMiddleware();

        this._authMiddleware = new AuthMiddleware();

         this._upload = multer({ dest: 'uploads/' });
    }

    criarRotasProfessor() {
        this._router.get('/', this._authMiddleware.autenticarToken ,this._professorControl.professor_read_all_control);
 
        this._router.get('/:idProfessor', this._authMiddleware.autenticarToken,this._professorControl.professor_read_by_id_control);

        this._router.get('/:idProfessor/disciplinas-turmas', this._authMiddleware.autenticarToken,this._professorControl.professor_read_disciplina_turma);
 
        this._router.post('/', this._authMiddleware.autenticarToken, this._professorMiddleware.validar_nomeProfessor, this._professorMiddleware.validar_senhaProfessor,this._professorControl.professor_create_control);

        this._router.delete('/:idProfessor', this._authMiddleware.autenticarToken,this._professorControl.professor_delete_control);

        this._router.put('/:idProfessor',  this._authMiddleware.autenticarToken,this._professorMiddleware.validar_nomeProfessor, this._professorMiddleware.validar_senhaProfessor,this._professorControl.professor_update_control);

        this._router.post('/upload-csv', this._authMiddleware.autenticarToken,this._upload.single('arquivo'), this._professorControl.professor_upload_csv_control);

        return this._router;
    }
}