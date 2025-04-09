const express = require('express');

const TurmaRouter = require('./router/TurmaRouter');

const app = express();

const portaServico = 80;

app.use(express.json());

const turmaRoteador = new TurmaRouter();

app.use('/turmas', turmaRoteador.criarRotasTurma());

app.listen(portaServico, () => { 
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});