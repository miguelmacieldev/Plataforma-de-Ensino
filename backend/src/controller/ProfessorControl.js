// Importa o módulo express para criação de APIs.
const express = require('express');
// Importa o modelo Professor para realizar operações relacionadas à entidade Professor.
const Professor = require('../model/Professor');

// Exporta a classe ProfessorControl, que controla as operações de CRUD para Professor.
module.exports = class ProfessorControl {
    // Método assíncrono para criar um novo professor.
    async professor_create_control(request, response) {
        var professor = new Professor();
        professor.nome = request.body.professor.nome;
        professor.telefone = request.body.professor.telefone;
        professor.senha = request.body.professor.senha;

        const isCreated = await professor.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Professor criado com sucesso' : 'Erro ao criar o professor (já existente ou dados inválidos)'
        };

        response.status(200).send(objResposta);
    }

    // Método assíncrono para excluir um professor.
    async professor_delete_control(request, response) {
        var professor = new Professor();
        professor.idProfessor = request.params.idProfessor;

        const isDeleted = await professor.delete();

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Professor excluído com sucesso' : 'Erro ao excluir o professor'
        };

        response.status(200).send(objResposta);
    }

    // Método assíncrono para atualizar os dados de um professor.
    async professor_update_control(request, response) {
        var professor = new Professor();
        professor.idProfessor = request.params.idProfessor;
        professor.nome = request.body.professor.nome;
        professor.telefone = request.body.professor.telefone;
        professor.senha = request.body.professor.senha;

        const isUpdated = await professor.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated ? 'Professor atualizado com sucesso' : 'Erro ao atualizar o professor'
        };

        response.status(200).send(objResposta);
    }

    // Método assíncrono para obter todos os professores.
    async professor_read_all_control(request, response) {
        var professor = new Professor();
        const resultado = await professor.readAll();

        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Executado com sucesso',
            professores: resultado
        };

        response.status(200).send(objResposta);
    }

    // Método assíncrono para obter um professor pelo ID.
    async professor_read_by_id_control(request, response) {
        var professor = new Professor();
        professor.idProfessor = request.params.idProfessor;

        const resultado = await professor.readByID();

        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Professor encontrado' : 'Professor não encontrado',
            professor: resultado
        };

        response.status(200).send(objResposta);
    }
};
