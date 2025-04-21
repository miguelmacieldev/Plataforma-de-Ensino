const express = require('express');

const TurmaRouter = require('./router/TurmaRouter');
const ProfessorRouter = require('./router/ProfessorRouter');
const AlunoRouter = require('./router/AlunoRouter');
const DisciplinaRouter = require('./router/DisciplinaRouter');
const DisciplinaProfessorRouter = require('./router/DisciplinaProfessorRouter');
const AtividadeRouter = require('./router/AtividadeRouter');
const AtividadeEntregueRouter = require('./router/AtividadeEntregueRouter');

const app = express();

const portaServico = 3000;

app.use(express.json());

const turmaRoteador = new TurmaRouter();
const professorRoteador = new ProfessorRouter();
const alunoRoteador = new AlunoRouter();
const disciplinaRoteador = new DisciplinaRouter();
const disciplinaProfessorRoteador = new DisciplinaProfessorRouter();
const atividadeRoteador = new AtividadeRouter();
const atividadeEntregueRoteador = new AtividadeEntregueRouter();

app.use('/turmas', turmaRoteador.criarRotasTurma());
app.use('/professores', professorRoteador.criarRotasProfessor());
app.use('/alunos', alunoRoteador.criarRotasAluno());
app.use('/disciplinas', disciplinaRoteador.criarRotasDisciplina());
app.use('/disciplinas-professores', disciplinaProfessorRoteador.criarRotasDisciplinaProfessor());
app.use('/atividades', atividadeRoteador.criarRotasAtividade());
app.use('/atividades-entregues', atividadeEntregueRoteador.criarRotasAtividadeEntregue());

app.listen(portaServico, () => {    
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});
