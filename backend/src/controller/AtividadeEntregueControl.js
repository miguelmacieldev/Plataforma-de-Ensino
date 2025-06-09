const AtividadeEntregue = require('../model/AtividadeEntregue');

module.exports = class AtividadeEntregueControl {
    async atividadeEntregue_create_control(request, response) {
        const model = new AtividadeEntregue();
        model.matriculaAluno = request.body.atividadeentregue.matriculaAluno;
        model.idAtividade = request.body.atividadeentregue.idAtividade;
        model.dataEntrega = request.body.atividadeentregue.dataEntrega;
        model.caminhoGravacao = request.body.atividadeentregue.caminhoGravacao;
        model.nota = request.body.atividadeentregue.nota;

        const isCreated = await model.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated
                ? 'Atividade entregue registrada com sucesso'
                : 'Erro ao registrar atividade entregue (verifique se matrícula ou idAtividade existem)'
        };

        response.status(200).send(objResposta);
    }

    async atividadeEntregue_update_control(request, response) {
        const model = new AtividadeEntregue();
        model.idAtividadeEntregue = request.params.idAtividadeEntregue;
        model.matriculaAluno = request.body.atividadeentregue.matriculaAluno;
        model.idAtividade = request.body.atividadeentregue.idAtividade;
        model.dataEntrega = request.body.atividadeentregue.dataEntrega;
        model.caminhoGravacao = request.body.atividadeentregue.caminhoGravacao;
        model.nota = request.body.atividadeentregue.nota;

        const isUpdated = await model.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated
                ? 'Atividade entregue atualizada com sucesso'
                : 'Erro ao atualizar atividade entregue (verifique se matrícula ou idAtividade existem)'
        };

        response.status(200).send(objResposta);
    }

    async atividadeEntregue_delete_control(request, response) {
        const model = new AtividadeEntregue();
        model.idAtividadeEntregue = request.params.idAtividadeEntregue;

        const isDeleted = await model.delete();

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted
                ? 'Atividade entregue excluída com sucesso'
                : 'Erro ao excluir atividade entregue'
        };

        response.status(200).send(objResposta);
    }

    async atividadeEntregue_read_all_control(request, response) {
        const model = new AtividadeEntregue();
        const resultado = await model.readAll();

        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Lista de atividades entregues obtida com sucesso',
            atividadesEntregues: resultado
        };

        response.status(200).send(objResposta);
    }

    async atividadeEntregue_read_by_id_control(request, response) {
        const model = new AtividadeEntregue();
        model.idAtividadeEntregue = request.params.idAtividadeEntregue;

        const resultado = await model.readByID();

        const objResposta = {
            cod: 1,
            status: !!resultado,
            msg: resultado
                ? 'Atividade entregue encontrada'
                : 'Atividade entregue não encontrada',
            atividadeEntregue: resultado
        };

        response.status(200).send(objResposta);
    }
};
