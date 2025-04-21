const DisciplinaProfessor = require('../model/DisciplinaProfessor');

module.exports = class DisciplinaProfessorControl {
    
    async disciplinaProfessor_create_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idProfessor = req.body.disciplinaprofessor.idProfessor;
        dp.idDisciplina = req.body.disciplinaprofessor.idDisciplina;

        const sucesso = await dp.create();

        res.status(200).send({
            cod: 1,
            status: sucesso,
            msg: sucesso ? 'Vínculo criado com sucesso.' : 'Professor ou Disciplina inválidos, ou vínculo já existe.',
        });
    }

    async disciplinaProfessor_delete_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idDisciplinaProfessor = req.params.idDisciplina;

        const sucesso = await dp.delete();

        res.status(200).send({
            cod: 1,
            status: sucesso,
            msg: sucesso ? 'Vínculo excluído com sucesso.' : 'Vínculo não encontrado.',
        });
    }

    async disciplinaProfessor_update_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idDisciplinaProfessor = req.params.idDisciplinaProfessor;
        dp.idProfessor = req.body.disciplinaprofessor.idProfessor;
        dp.idDisciplina = req.body.disciplinaprofessor.idDisciplina;

        const sucesso = await dp.update();

        res.status(200).send({
            cod: 1,
            status: sucesso,
            msg: sucesso ? 'Vínculo atualizado com sucesso.' : 'Professor ou Disciplina inválidos, ou vínculo não encontrado.',
        });
    }

    async disciplinaProfessor_read_by_id_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idDisciplinaProfessor = req.params.idDisciplinaProfessor;

        const vinculo = await dp.readByID();

        if (vinculo) {
            res.status(200).send({
                cod: 1,
                status: true,
                msg: 'Vínculo encontrado.',
                vinculo: vinculo,
            });
        } else {
            res.status(404).send({
                cod: 0,
                status: false,
                msg: 'Vínculo não encontrado.',
            });
        }
    }

    async disciplinaProfessor_read_all_control(req, res) {
        const dp = new DisciplinaProfessor();
        const lista = await dp.readAll();

        res.status(200).send({
            cod: 1,
            status: true,
            msg: 'Lista de vínculos carregada.',
            lista: lista,
        });
    }
};
