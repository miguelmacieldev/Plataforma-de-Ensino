const express = require('express');
const Atividade = require('../model/Atividade');
const fs = require('fs');
const path = require('path');

module.exports = class AtividadeControl {
    async atividade_create_control(request, response) {
        const atividade = new Atividade();
        atividade.descricao = request.body.atividade.descricao;
        atividade.devolucao = request.body.atividade.devolucao;
        atividade.dataPostagem = request.body.atividade.dataPostagem;
        atividade.dataEntrega = request.body.atividade.dataEntrega;
        atividade.idDisciplinaProfessor = request.body.atividade.idDisciplinaProfessor;

        if (request.file) {
            atividade.caminhoGravacao = '/uploads/' + request.file.filename;
        } else {
            atividade.caminhoGravacao = null; 
        }

        const isCreated = await atividade.create();

        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Atividade criada com sucesso' : 'Erro ao criar atividade',
        };

        response.status(200).send(objResposta);
    }


   async atividade_update_control(request, response) {
    try {
        const atividade = new Atividade();
        atividade.idAtividade = request.params.idAtividade;
        
        const atividadeData = JSON.parse(request.body.atividade);
        
        atividade.descricao = atividadeData.descricao;
        atividade.devolucao = atividadeData.devolucao;
        atividade.dataPostagem = atividadeData.dataPostagem;
        atividade.dataEntrega = atividadeData.dataEntrega;
        atividade.idDisciplinaProfessor = atividadeData.idDisciplinaProfessor;

        // Verifica se deve manter o arquivo existente
        if (request.body.manterArquivo === 'true') {
            // Não faz nada, mantém o caminho existente
        } 
        // Se enviou novo arquivo
        else if (request.file) {
            atividade.caminhoGravacao = '/uploads/' + request.file.filename;
        } 
        // Se não enviou arquivo e não marcou para manter
        else {
            atividade.caminhoGravacao = null;
        }

        const isUpdated = await atividade.update();

        const objResposta = {
            cod: 1,
            status: isUpdated,
            msg: isUpdated ? 'Atividade atualizada com sucesso' : 'Erro ao atualizar atividade'
        };

        response.status(200).send(objResposta);
    } catch (error) {
        console.error("Erro ao atualizar atividade:", error);
        response.status(500).send({
            cod: 0,
            status: false,
            msg: 'Erro interno ao processar a atualização'
        });
    }
}

   async atividade_delete_control(request, response) {
    try {
        const atividade = new Atividade();
        atividade.idAtividade = request.params.idAtividade;

        // Primeiro obtemos a atividade para pegar o caminho do arquivo
        const atividadeParaExcluir = await atividade.readByID();
        
        if (!atividadeParaExcluir) {
            return response.status(404).json({
                cod: 0,
                status: false,
                msg: 'Atividade não encontrada'
            });
        }

        const isDeleted = await atividade.delete();

        // Se foi deletado com sucesso e tinha um arquivo, deleta o arquivo também
        
        if (isDeleted && atividadeParaExcluir.caminhoGravacao) {
            try {
                // Remove o '/uploads/' do caminho para obter o nome do arquivo
                const nomeArquivo = atividadeParaExcluir.caminhoGravacao.replace('/uploads/', '');
                const caminhoCompleto = path.join(__dirname, '..', 'uploads', nomeArquivo);
                
                if (fs.existsSync(caminhoCompleto)) {
                    fs.unlinkSync(caminhoCompleto);
                }
            } catch (error) {
                console.error('Erro ao remover arquivo:', error);
                // Não falha a operação principal se não conseguir deletar o arquivo
            }
        }

        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Atividade excluída com sucesso' : 'Erro ao excluir atividade (Alunos já fizeram entregas)'
        };

        response.status(200).send(objResposta);
    } catch (error) {
        console.error("Erro ao excluir atividade:", error);
        response.status(500).send({
            cod: 0,
            status: false,
            msg: 'Erro interno ao excluir atividade'
        });
    }
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
