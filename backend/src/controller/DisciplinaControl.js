// Importa o módulo express para criação de APIs.
const express = require('express');
// Importa o modelo Disciplina para realizar operações relacionadas à entidade Disciplina.
const Disciplina = require('../model/Disciplina');

// Exporta a classe DisciplinaControl, que controla as operações de CRUD para Disciplina.
module.exports = class DisciplinaControl {
    // Criar uma nova disciplina
    async disciplina_create_control(request, response) {
        var disciplina = new Disciplina();
        disciplina.nome = request.body.disciplina.nome;
        disciplina.idTurma = request.body.disciplina.idTurma;

        const isCreated = await disciplina.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Disciplina criada com sucesso' : 'Erro ao criar a disciplina (já existente, dados inválidos ou turma não encontrada)'
        };

        response.status(200).send(objResposta);
    }

    // Deletar uma disciplina por ID
    async disciplina_delete_control(request, response) {
        var disciplina = new Disciplina();
        disciplina.idDisciplina = request.params.idDisciplina;

        const isDeleted = await disciplina.delete();

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Disciplina excluída com sucesso' : 'Erro ao excluir a disciplina'
        };

        response.status(200).send(objResposta);
    }

    // Atualizar os dados de uma disciplina
    async disciplina_update_control(request, response) {
        var disciplina = new Disciplina();
        disciplina.idDisciplina = request.params.idDisciplina;
        disciplina.nome = request.body.disciplina.nome;
        disciplina.idTurma = request.body.disciplina.idTurma;

        const isUpdated = await disciplina.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated ? 'Disciplina atualizada com sucesso' : 'Erro ao atualizar a disciplina (turma não encontrada ou dados inválidos)'
        };

        response.status(200).send(objResposta);
    }

    // Obter todas as disciplinas
    async disciplina_read_all_control(request, response) {
        var disciplina = new Disciplina();
        const resultado = await disciplina.readAll();

        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Disciplinas encontradas com sucesso',
            disciplinas: resultado
        };

        response.status(200).send(objResposta);
    }

    // Obter uma disciplina pelo ID
    async disciplina_read_by_id_control(request, response) {
        var disciplina = new Disciplina();
        disciplina.idDisciplina = request.params.idDisciplina;

        const resultado = await disciplina.readByID();

        const objResposta = {
            cod: 1,
            status: !!resultado,
            msg: resultado ? 'Disciplina encontrada' : 'Disciplina não encontrada',
            disciplina: resultado
        };

        response.status(200).send(objResposta);
    }
};
