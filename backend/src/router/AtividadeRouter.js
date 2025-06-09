const express = require('express');

const AtividadeControl = require('../controller/AtividadeControl');

const AuthMiddleware = require('../middleware/AuthMiddleware');

const AtividadeMiddleware = require('../middleware/AtividadeMiddleware');

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

module.exports = class AtividadeRouter {

    constructor() {
        this._router = express.Router();

        this._atividadeControl = new AtividadeControl();

        this._authMiddleware = new AuthMiddleware();        

        this._atividadeMiddleware = new AtividadeMiddleware();
    }

    criarRotasAtividade() {
        this._router.get('/',  this._authMiddleware.autenticarToken,this._atividadeControl.atividade_read_all_control);

        this._router.get('/:idAtividade' , this._authMiddleware.autenticarToken,this._atividadeControl.atividade_read_by_id_control);
        
        this._router.post('/', this._authMiddleware.autenticarToken , upload.single('arquivo'), this._atividadeControl.atividade_create_control);

        this._router.delete('/:idAtividade', this._authMiddleware.autenticarToken, this._atividadeControl.atividade_delete_control);

        this._router.put('/:idAtividade',  this._authMiddleware.autenticarToken, upload.single('arquivo'),this._atividadeControl.atividade_update_control);

        return this._router;
    }
}