const fs = require('fs');

const csv = require('csv-parser');

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

    async aluno_upload_csv_control(req, res) {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: 'Nenhum arquivo enviado' });
        }
    
        const alunosCriados = [];
        const alunosIgnorados = [];
        const promessas = [];
    
        fs.createReadStream(req.file.path)
            .pipe(csv({ separator: ';' }))
            .on('data', (linha) => {
                const promessa = (async () => {
                    // Limpa os nomes das colunas e os valores
                    const linhaLimpa = {};
                    for (const chave in linha) {
                        linhaLimpa[chave.trim()] = linha[chave].trim();
                    }
    
                    const aluno = new Aluno();
                    aluno.matricula = linhaLimpa.matricula || null;
                    aluno.nome = linhaLimpa.nome || null;
                    aluno.telefone = linhaLimpa.telefone || null;
                    aluno.email = linhaLimpa.email || null;
                    aluno.idTurmaPrimaria = linhaLimpa.idTurmaPrimaria || null;
                    aluno.idTurmaSecundaria = linhaLimpa.idTurmaSecundaria || null;

                    // Verifica se já existe
                    if (await aluno.isAluno()) {
                        alunosIgnorados.push({
                            matricula: aluno.matricula,
                            nome: aluno.nome,
                            telefone: aluno.telefone,
                            email: aluno.email,
                            idTurmaPrimaria : aluno.idTurmaPrimaria,
                            idTurmaSecundaria : aluno.idTurmaSecundaria
                        });
                    } else {
                        const criada = await aluno.create(); 
                        if (criada) {
                            alunosCriados.push({
                                matricula: aluno.matricula,
                                nome: aluno.nome,
                                telefone: aluno.telefone,
                                email: aluno.email,
                                idTurmaPrimaria : aluno.idTurmaPrimaria,
                                idTurmaSecundaria : aluno.idTurmaSecundaria
                            });
                        }
                    }
                })();
    
                promessas.push(promessa);
            })
            .on('end', async () => {
                try {
                    await Promise.all(promessas);
                    fs.unlinkSync(req.file.path);
                    res.status(200).json({
                        status: true,
                        msg: 'Processamento finalizado',
                        criadas: alunosCriados.length,
                        ignoradas: alunosIgnorados.length,
                        alunosCriados : alunosCriados,
                        alunosIgnorados : alunosIgnorados
                    });
                } catch (erro) {
                    console.error('Erro ao processar linhas do CSV:', erro);
                    res.status(500).json({ status: false, msg: 'Erro ao processar os dados do CSV' });
                }
            })
            .on('error', (err) => {
                console.error('Erro ao ler CSV:', err);
                res.status(500).json({ status: false, msg: 'Erro ao processar o arquivo CSV' });
            });
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
