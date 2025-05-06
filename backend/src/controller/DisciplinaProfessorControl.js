const fs = require('fs');

const csv = require('csv-parser');

const DisciplinaProfessor = require('../model/DisciplinaProfessor');

module.exports = class DisciplinaProfessorControl {
    
    async disciplinaProfessor_create_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idProfessor = req.body.disciplinaprofessor.idProfessor;
        dp.idDisciplina = req.body.disciplinaprofessor.idDisciplina;

        const isCreated = await dp.create();

        res.status(200).send({
            cod: 1,
            status: isCreated,
            msg: isCreated? 'Vínculo criado com sucesso.' : 'Professor ou Disciplina inválidos, ou vínculo já existe.',
        });
    }

    async disciplinaProfessor_upload_csv_control(req, res) {
        if (!req.file) {
            return res.status(400).json({ status: false, msg: 'Nenhum arquivo enviado' });
        }
    
        const disciplinasProfessoresCriados = [];
        const disciplinasProfessoresIgnorados = [];
        const promessas = [];
    
        fs.createReadStream(req.file.path)
            .pipe(csv({ separator: ';' }))
            .on('data', (linha) => {
                const promessa = (async () => {
                    const linhaLimpa = {};
                    for (const chave in linha) {
                        linhaLimpa[chave.trim()] = linha[chave].trim();
                    }
    
                    const disciplinaProfessor = new DisciplinaProfessor();     
                    disciplinaProfessor.idDisciplina = linhaLimpa.idDisciplina || null;
                    disciplinaProfessor.idProfessor = linhaLimpa.idProfessor || null;

                    if (await disciplinaProfessor.vinculoExiste()) {
                        disciplinasProfessoresIgnorados.push({
                            idDisciplina: disciplinaProfessor.idDisciplina,
                            idProfessor: disciplinaProfessor.idProfessor
                        });
                    } else {
                        const criada = await disciplinaProfessor.create(); 
                        if (criada) {
                            disciplinasProfessoresCriados.push({
                                idDisciplina: disciplinaProfessor.idDisciplina,
                                idProfessor: disciplinaProfessor.idProfessor
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
                        criadas: disciplinasProfessoresCriados.length,
                        ignoradas: disciplinasProfessoresIgnorados.length,
                        disciplinasProfessoresCriados : disciplinasProfessoresCriados,
                        disciplinasProfessoresIgnorados : disciplinasProfessoresIgnorados
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


    async disciplinaProfessor_delete_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idDisciplinaProfessor = req.params.idDisciplinaProfessor;

        const isDeleted = await dp.delete();

        let disciplinasProfessores = [];

        if(isDeleted){
            disciplinasProfessores = await dp.readAll();
        }

        res.status(200).send({
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Vínculo excluído com sucesso.' : 'Vínculo não encontrado.',
            disciplinasProfessores : disciplinasProfessores
        });
    }

    async disciplinaProfessor_update_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idDisciplinaProfessor = req.params.idDisciplinaProfessor;
        dp.idProfessor = req.body.disciplinaprofessor.idProfessor;
        dp.idDisciplina = req.body.disciplinaprofessor.idDisciplina;

        const isUpdated = await dp.update();

        res.status(200).send({
            cod: 1,
            status: isUpdated,
            msg: isUpdated? 'Vínculo atualizado com sucesso.' : 'Professor ou Disciplina inválidos, vínculo não encontrado ou vínculo duplicado'
        });
    }

    async disciplinaProfessor_read_by_id_control(req, res) {
        const dp = new DisciplinaProfessor();
        dp.idDisciplinaProfessor = req.params.idDisciplinaProfessor;

        const resultado = await dp.readByID();

        if (resultado) {
            res.status(200).send({
                cod: 1,
                status: true,
                msg: 'Vínculo encontrado.',
                disciplinaProfessor: resultado,
            });
        } else {
            res.status(404).send({
                cod: 0,
                status: false,
                msg: 'Vínculo não encontrado.',
            });
        }
    }

    async disciplinaProfessor_read_all_control(req, res) {
        const dp = new DisciplinaProfessor();
        const disciplinasProfessores = await dp.readAll();

        res.status(200).send({
            cod: 1,
            status: true,
            msg: 'Lista de vínculos carregada.',
            disciplinasProfessores: disciplinasProfessores
        });
    }
};
