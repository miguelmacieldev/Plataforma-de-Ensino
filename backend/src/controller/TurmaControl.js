const fs = require('fs');

const csv = require('csv-parser');

const express = require('express');

const Turma = require('../model/Turma');

module.exports = class TurmaControl {
    async turma_create_control(request, response) {
        var turma = new Turma();
        turma.descricao = request.body.turma.descricao;
        turma.curso = request.body.turma.curso;

        const isCreated = await turma.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Turma criada com sucesso' : 'Erro ao criar a turma (turma já existente ou entradas inválidas)'
        };

        response.status(200).send(objResposta);
    }

    async turma_upload_csv_control(req, res) {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: 'Nenhum arquivo enviado' });
        }
    
        const turmasCriadas = [];
        const turmasIgnoradas = [];
        const promessas = [];
    
        fs.createReadStream(req.file.path)
            .pipe(csv({ separator: ';' }))
            .on('data', (linha) => {
                const promessa = (async () => {
                    // Limpa nomes de colunas e valores
                    const linhaLimpa = {};
                    for (const chave in linha) {
                        linhaLimpa[chave.trim()] = linha[chave]?.trim();
                    }
    
                    const turma = new Turma();
                    turma.descricao = linhaLimpa.descricao || null;
                    turma.curso = linhaLimpa.curso || null;
    
                    if (await turma.isTurma()) {
                        turmasIgnoradas.push({
                            descricao: turma.descricao,
                            curso: turma.curso
                        });
                    } else {
                        const criada = await turma.create();
                        if (criada) {
                            turmasCriadas.push({
                                descricao: turma.descricao,
                                curso: turma.curso
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
                        criadas: turmasCriadas.length,
                        ignoradas: turmasIgnoradas.length,
                        turmasCriadas,
                        turmasIgnoradas
                    });
                } catch (erro) {
     
                    res.status(500).json({ status: false, msg: 'Erro ao processar os dados do CSV' });
                }
            })
            .on('error', (err) => {
            
                res.status(500).json({ status: false, msg: 'Erro ao processar o arquivo CSV' });
            });
    }
    
       
    async turma_delete_control(request, response) {
        var turma = new Turma();
        turma.idTurma = request.params.idTurma;

        const isDeleted = await turma.delete();

        let turmas = [];

        if (isDeleted) {
            turmas = await turma.readAll(); 
        }

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Turma excluída com sucesso' : 'Erro ao excluir a turma',
            turmas: turmas
        };

        response.status(200).send(objResposta);
    }

    async turma_update_control(request, response) {
        var turma = new Turma();

        turma.idTurma = request.params.idTurma;
        turma.descricao = request.body.turma.descricao;
        turma.curso = request.body.turma.curso;

        const isUpdated = await turma.update();

        const objResposta = {
            cod: 1,
            status: true,
            msg: isUpdated ? 'Turma atualizada com sucesso' : 'Erro ao atualizar a turma'
        };

        response.status(200).send(objResposta);
    }

    async turma_read_all_control(request, response) {

        var turma = new Turma();

        const resultado = await turma.readAll();

        
        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Executado com sucesso',
            turmas: resultado
        };

        response.status(200).send(objResposta);
    }

    async turma_read_by_id_control(request, response) {
        var turma = new Turma();
        turma.idTurma = request.params.idTurma;

        const resultado = await turma.readByID();

        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Turma encontrada' : 'Turma não encontrada',
            turma: resultado
        };

        response.status(200).send(objResposta);
    }
};
