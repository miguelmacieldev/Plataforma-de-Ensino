const express = require('express');
const Atividade = require('../model/Atividade');

module.exports = class AtividadeControl {
    async atividade_create_control(request, response) {
        const atividade = new Atividade();
        atividade.descricao = request.body.atividade.descricao;
        atividade.devolucao = request.body.atividade.devolucao;
        atividade.caminhoGravacao = request.body.atividade.caminhoGravacao;
        atividade.dataPostagem = request.body.atividade.dataPostagem;
        atividade.dataEntrega = request.body.atividade.dataEntrega;
        atividade.idDisciplinaProfessor = request.body.atividade.idDisciplinaProfessor;

        const isCreated = await atividade.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Atividade criada com sucesso' : 'Erro ao criar atividade (verifique os dados ou se o idDisciplinaProfessor existe)'
        };

        response.status(200).send(objResposta);
    }

    async atividade_update_control(request, response) {
        const atividade = new Atividade();
        atividade.idAtividade = request.params.idAtividade;
        atividade.descricao = request.body.atividade.descricao;
        atividade.devolucao = request.body.atividade.devolucao;
        atividade.caminhoGravacao = request.body.atividade.caminhoGravacao;
        atividade.dataPostagem = request.body.atividade.dataPostagem;
        atividade.dataEntrega = request.body.atividade.dataEntrega;
        atividade.idDisciplinaProfessor = request.body.atividade.idDisciplinaProfessor;
        console.log(atividade.idDisciplinaProfessor)

        const isUpdated = await atividade.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated ? 'Atividade atualizada com sucesso' : 'Erro ao atualizar atividade (verifique se idDisciplinaProfessor existe)'
        };

        response.status(200).send(objResposta);
    }

    async atividade_delete_control(request, response) {
        const atividade = new Atividade();
        atividade.idAtividade = request.params.idAtividade;

        const isDeleted = await atividade.delete();

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Atividade excluída com sucesso' : 'Erro ao excluir atividade'
        };

        response.status(200).send(objResposta);
    }

    async atividade_read_all_control(request, response) {
        const atividade = new Atividade();
        const resultado = await atividade.readAll();

        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Lista de atividades obtida com sucesso',
            atividades: resultado
        };

        response.status(200).send(objResposta);
    }

    async atividade_read_by_id_control(request, response) {
        const atividade = new Atividade();
        atividade.idAtividade = request.params.idAtividade;

        const resultado = await atividade.readByID();

        const objResposta = {
            cod: 1,
            status: !!resultado,
            msg: resultado ? 'Atividade encontrada' : 'Atividade não encontrada',
            atividade: resultado
        };

        response.status(200).send(objResposta);
    }
};
