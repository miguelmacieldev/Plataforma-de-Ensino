const express = require('express');

const AtividadeEntregueControl = require('../controller/AtividadeEntregueControl');

const AtividadeEntregueMiddleware = require('../middleware/AtividadeEntregueMiddleware');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const multer = require('multer');

const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });


module.exports = class AtividadeEntregueRouter {

    constructor() {
        this._router = express.Router();

        this._authMiddleware = new AuthMiddleware();        

        this._atividadeEntregueControl = new AtividadeEntregueControl();

        this._atividadeEntregueMiddleware = new AtividadeEntregueMiddleware();
    }

    criarRotasAtividadeEntregue() {
        this._router.get('/',  this._authMiddleware.autenticarToken,this._atividadeEntregueControl.atividadeEntregue_read_all_control);
 
        this._router.get('/:idAtividadeEntregue', this._authMiddleware.autenticarToken,this._atividadeEntregueControl.atividadeEntregue_read_by_id_control);

        this._router.get('/atividades/:idAtividade', this._authMiddleware.autenticarToken,this._atividadeEntregueControl.atividadeEntregue_read_atividades_by_id_control);
       
        this._router.get('/:idAtividade/:matriculaAluno', this._authMiddleware.autenticarToken,this._atividadeEntregueControl.atividadeEntregue_read_atividade_by_aluno_control);

        this._router.post('/', this._authMiddleware.autenticarToken, upload.single('arquivo'),this._atividadeEntregueControl.atividadeEntregue_create_control);

        this._router.delete('/:idAtividadeEntregue', this._authMiddleware.autenticarToken,this._atividadeEntregueControl.atividadeEntregue_delete_control);

        this._router.put('/:idAtividadeEntregue', this._authMiddleware.autenticarToken, this._atividadeEntregueControl.atividadeEntregue_update_control);

        return this._router;
    }
}