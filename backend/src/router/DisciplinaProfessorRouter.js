const multer = require('multer');

const path = require('path');

const express = require('express');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const DisciplinaProfessorControl = require('../controller/DisciplinaProfessorControl');

const DisciplinaProfessorMiddleware = require('../middleware/DisciplinaProfessorMiddleware');

module.exports = class DisciplinaProfessorRouter {

    constructor() {
        this._router = express.Router();

        this._disciplinaProfessorControl = new DisciplinaProfessorControl();

        this._disciplinaProfessorMiddleware = new DisciplinaProfessorMiddleware();

        this._authMiddleware = new AuthMiddleware();

        this._upload = multer({ dest: 'uploads/' });
    }

    criarRotasDisciplinaProfessor() {
        this._router.get('/', this._authMiddleware.autenticarToken,this._disciplinaProfessorControl.disciplinaProfessor_read_all_control);
 
        this._router.get('/:idDisciplinaProfessor', this._authMiddleware.autenticarToken,this._disciplinaProfessorControl.disciplinaProfessor_read_by_id_control);
        
        this._router.get('/disciplinas/:idDisciplina', this._authMiddleware.autenticarToken,this._disciplinaProfessorControl.disciplinaProfessor_read_by_id_disciplina_control);
        
        this._router.get('/professores/:idProfessor', this._authMiddleware.autenticarToken,this._disciplinaProfessorControl.disciplinaProfessor_read_by_id_professor_control);
 
        this._router.post('/', this._authMiddleware.autenticarToken,this._disciplinaProfessorMiddleware.validar_idDisciplinaProfessor, this._disciplinaProfessorControl.disciplinaProfessor_create_control);

        this._router.delete('/:idDisciplinaProfessor', this._authMiddleware.autenticarToken,this._disciplinaProfessorControl.disciplinaProfessor_delete_control);

        this._router.put('/:idDisciplinaProfessor', this._authMiddleware.autenticarToken,this._disciplinaProfessorMiddleware.validar_idDisciplinaProfessor,this._disciplinaProfessorControl.disciplinaProfessor_update_control);

        this._router.post('/upload-csv', this._authMiddleware.autenticarToken,this._upload.single('arquivo'), this._disciplinaProfessorControl.disciplinaProfessor_upload_csv_control);

        return this._router;
    }
}