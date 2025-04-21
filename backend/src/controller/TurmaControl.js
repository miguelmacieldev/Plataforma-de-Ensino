// Importa o módulo express para criação de APIs.
const express = require('express');
// Importa o modelo Turma para realizar operações relacionadas à entidade Turma.
const Turma = require('../model/Turma');

// Exporta a classe TurmaControl, que controla as operações de CRUD (Create, Read, Update, Delete) para a Turma.
module.exports = class TurmaControl {
    // Método assíncrono para criar uma nova turma.
    async turma_create_control(request, response) {
        // Cria uma nova instância do modelo Turma.
        var turma = new Turma();
        // Atribui os dados da turma passados no corpo da requisição (request body) à instância criada.
        turma.descricao = request.body.turma.descricao;
        turma.curso = request.body.turma.curso;

        // Chama o método create() do modelo Turma para inserir a nova turma no banco de dados.
        const isCreated = await turma.create();

        // Cria um objeto de resposta contendo o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Turma criada com sucesso' : 'Erro ao criar a turma (turma já existente ou entradas inválidas)'
        };

        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para excluir uma turma existente.
    async turma_delete_control(request, response) {
        // Cria uma nova instância do modelo Turma.
        var turma = new Turma();
        // Atribui o ID da turma passado como parâmetro na URL (request params) à instância criada.
        turma.idTurma = request.params.idTurma;

        // Chama o método delete() do modelo Turma para excluir a turma do banco de dados.
        const isDeleted = await turma.delete();

        // Cria um objeto de resposta com o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Turma excluída com sucesso' : 'Erro ao excluir a turma'
        };

        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para atualizar uma turma existente.
    async turma_update_control(request, response) {
        // Cria uma nova instância do modelo Turma.
        var turma = new Turma();
        // Atribui o ID e os dados da turma passados na URL e no corpo da requisição, respectivamente.
        turma.idTurma = request.params.idTurma;
        turma.descricao = request.body.turma.descricao;
        turma.curso = request.body.turma.curso;

        // Chama o método update() do modelo Turma para atualizar a turma no banco de dados.
        const isUpdated = await turma.update();

        // Cria um objeto de resposta com o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: true,
            msg: isUpdated ? 'Turma atualizada com sucesso' : 'Erro ao atualizar a turma'
        };

        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para obter todas as turmas.
    async turma_read_all_control(request, response) {
        // Cria uma nova instância do modelo Turma.
        var turma = new Turma();
        // Chama o método readAll() para buscar todas as turmas no banco de dados.
        const resultado = await turma.readAll();

        // Cria um objeto de resposta contendo o código, status, mensagem e a lista de turmas.
        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Executado com sucesso',
            turmas: resultado
        };

        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para obter uma turma pelo ID.
    async turma_read_by_id_control(request, response) {
        // Cria uma nova instância do modelo Turma.
        var turma = new Turma();
        // Atribui o ID da turma passado como parâmetro na URL (request params) à instância criada.
        turma.idTurma = request.params.idTurma;

        // Chama o método readByID() para buscar a turma pelo ID no banco de dados.
        const resultado = await turma.readByID();

        // Cria um objeto de resposta contendo o código, status, mensagem e a turma encontrada (ou não).
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Turma encontrada' : 'Turma não encontrada',
            turma: resultado
        };

        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }
};
