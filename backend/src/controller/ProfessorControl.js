const fs = require('fs');

const csv = require('csv-parser');
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

    async professor_upload_csv_control(req, res) {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: 'Nenhum arquivo enviado' });
        }
    
        const professoresCriados = [];
        const professoresIgnorados = [];
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
    
                    const professor = new Professor();
                    professor.nome = linhaLimpa.nome || null;
                    professor.telefone = linhaLimpa.telefone || null;
                    professor.senha = linhaLimpa.senha || null;
    
                    // Verifica se já existe
                    if (await professor.isProfessor()) {
                        professoresIgnorados.push({
                            nome: professor.nome,
                            telefone: professor.telefone,
                            senha: professor.senha
                        });
                    } else {
                        const criada = await professor.create(); // corrigido: antes estava chamando turma.create()
                        if (criada) {
                            professoresCriados.push({
                                nome: professor.nome,
                                telefone: professor.telefone,
                                senha: professor.senha
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
                        criadas: professoresCriados.length,
                        ignoradas: professoresIgnorados.length,
                        professoresCriados,
                        professoresIgnorados
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
