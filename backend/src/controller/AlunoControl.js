const express = require('express');
const Aluno = require('../model/Aluno');

module.exports = class AlunoControl {
    // Criar novo aluno
    async aluno_create_control(request, response) {
        const aluno = new Aluno();
        aluno.matricula = request.body.aluno.matricula;
        aluno.nome = request.body.aluno.nome;
        aluno.telefone = request.body.aluno.telefone;
        aluno.email = request.body.aluno.email;
        aluno.idTurmaPrimaria = request.body.aluno.idTurmaPrimaria;
        aluno.idTurmaSecundaria = request.body.aluno.idTurmaSecundaria;

        const isCreated = await aluno.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Aluno criado com sucesso' : 'Erro ao criar o aluno (já existente ou turmas inválidas)'
        };

        response.status(200).send(objResposta);
    }

    // Atualizar aluno
    async aluno_update_control(request, response) {
        const aluno = new Aluno();
        aluno.matricula = request.params.matricula;
        aluno.nome = request.body.aluno.nome;
        aluno.telefone = request.body.aluno.telefone;
        aluno.email = request.body.aluno.email;
        aluno.idTurmaPrimaria = request.body.aluno.idTurmaPrimaria;
        aluno.idTurmaSecundaria = request.body.aluno.idTurmaSecundaria;

        const isUpdated = await aluno.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated ? 'Aluno atualizado com sucesso' : 'Erro ao atualizar o aluno (verifique se a matrícula existe e as turmas são válidas)'
        };

        response.status(200).send(objResposta);
    }

    // Excluir aluno
    async aluno_delete_control(request, response) {
        const aluno = new Aluno();
        aluno.matricula = request.params.matricula;

        const isDeleted = await aluno.delete();

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Aluno excluído com sucesso' : 'Erro ao excluir o aluno'
        };

        response.status(200).send(objResposta);
    }

    // Listar todos os alunos
    async aluno_read_all_control(request, response) {
        const aluno = new Aluno();
        const resultado = await aluno.readAll();

        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Lista de alunos obtida com sucesso',
            alunos: resultado
        };

        response.status(200).send(objResposta);
    }

    // Obter aluno por matrícula
    async aluno_read_by_id_control(request, response) {
        const aluno = new Aluno();
        aluno.matricula = request.params.matricula;
        console.log(request.params.matricula)

        const resultado = await aluno.readByID();

        const objResposta = {
            cod: 1,
            status: !!resultado,
            msg: resultado ? 'Aluno encontrado' : 'Aluno não encontrado',
            aluno: resultado
        };

        response.status(200).send(objResposta);
    }
};
