const express = require('express');

const multer = require('multer');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const path = require('path');

const TurmaControl = require('../controller/TurmaControl');

const TurmaMiddleware = require('../middleware/TurmaMiddleware');

module.exports = class TurmaRouter {

    constructor() {
        this._router = express.Router();

        this._turmaControl = new TurmaControl();

        this._authMiddleware = new AuthMiddleware();

        this._turmaMiddleware = new TurmaMiddleware();

        this._upload = multer({ dest: 'uploads/' });
    }

    criarRotasTurma() {
        this._router.get('/', this._authMiddleware.autenticarToken , this._turmaControl.turma_read_all_control);
 
        this._router.get('/:idTurma', this._authMiddleware.autenticarToken,this._turmaControl.turma_read_by_id_control);
 
        this._router.post('/', this._authMiddleware.autenticarToken,this._turmaMiddleware.validar_descricaoTurma, this._turmaControl.turma_create_control);

        this._router.delete('/:idTurma', this._authMiddleware.autenticarToken,this._turmaControl.turma_delete_control);

        this._router.put('/:idTurma',  this._authMiddleware.autenticarToken,this._turmaControl.turma_update_control);

        this._router.post('/upload-csv', this._authMiddleware.autenticarToken,this._upload.single('arquivo'), this._turmaControl.turma_upload_csv_control);

        return this._router;
    }
}