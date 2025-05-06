const express = require('express');

const AtividadeControl = require('../controller/AtividadeControl');

const AtividadeMiddleware = require('../middleware/AtividadeMiddleware');

module.exports = class AtividadeRouter {

    constructor() {
        this._router = express.Router();

        this._atividadeControl = new AtividadeControl();

        this._atividadeMiddleware = new AtividadeMiddleware();
    }

    criarRotasAtividade() {
        this._router.get('/',  this._atividadeControl.atividade_read_all_control);
 
        this._router.get('/:idAtividade' , this._atividadeControl.atividade_read_by_id_control);

        this._router.post('/', this._atividadeMiddleware.validar_idDisciplinaProfessor, this._atividadeControl.atividade_create_control);

        this._router.delete('/:idAtividade', this._atividadeControl.atividade_delete_control);

        this._router.put('/:idAtividade',   this._atividadeMiddleware.validar_idDisciplinaProfessor,this._atividadeControl.atividade_update_control);

        return this._router;
    }
}