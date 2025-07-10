const fs = require('fs');

const csv = require('csv-parser');

const express = require('express');

const Disciplina = require('../model/Disciplina');

module.exports = class DisciplinaControl {
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

    
    async disciplina_upload_csv_control(req, res) {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: 'Nenhum arquivo enviado' });
        }
    
        const disciplinasCriados = [];
        const disciplinasIgnorados = [];
        const promessas = [];
    
        fs.createReadStream(req.file.path)
            .pipe(csv({ separator: ';' }))
            .on('data', (linha) => {
                const promessa = (async () => {
                    const linhaLimpa = {};
                    for (const chave in linha) {
                        linhaLimpa[chave.trim()] = linha[chave].trim();
                    }
    
                    const disciplina = new Disciplina();     
                    disciplina.nome = linhaLimpa.nome || null;
                    disciplina.idTurma = linhaLimpa.idTurma || null;


                    if (await disciplina.isDisciplina()) {
                        disciplinasIgnorados.push({
                            nome: disciplina.nome,
                            idTurma: disciplina.idTurma,
                        });
                    } else {
                        const criada = await disciplina.create(); 
                        if (criada) {
                            disciplinasCriados.push({
                                nome: disciplina.nome,
                                idTurma: disciplina.idTurma,
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
                        criadas: disciplinasCriados.length,
                        ignoradas: disciplinasIgnorados.length,
                        disciplinasCriados : disciplinasCriados,
                        disciplinasIgnorados : disciplinasIgnorados
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

    async disciplina_delete_control(request, response) {
        var disciplina = new Disciplina();
        disciplina.idDisciplina = request.params.idDisciplina;

        const isDeleted = await disciplina.delete();

        let disciplinas = [];

        if(isDeleted){
            disciplinas = await disciplina.readAll();
        }

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Disciplina excluída com sucesso' : 'Erro ao excluir a disciplina', 
            disciplinas : disciplinas
        };

        response.status(200).send(objResposta);
    }

    async disciplina_update_control(request, response) {
        var disciplina = new Disciplina();
        disciplina.idDisciplina = request.params.idDisciplina;
        disciplina.nome = request.body.disciplina.nome;
        disciplina.idTurma = request.body.disciplina.idTurma;

        const isUpdated = await disciplina.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated ? 'Disciplina atualizada com sucesso' : 'Erro ao atualizar a disciplina (turma não encontrada, dados inválidos ou disciplina já cadastrada)'
        };

        response.status(200).send(objResposta);
    }

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

    async disciplina_read_disciplina_turma(req, res) {
        const idTurma = req.params.idTurma;
        
        var disciplina = new Disciplina();
        const resultado = await disciplina.buscarPorTurma(idTurma);
        
        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Disciplinas encontradas com sucesso',
            disciplinas: resultado
        };

        res.status(200).json(objResposta);
    }



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
