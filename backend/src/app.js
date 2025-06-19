
const express = require('express');
const path = require('path');
const cors = require('cors');
const LoginRouter = require('./router/LoginRouter');
const TurmaRouter = require('./router/TurmaRouter');
const ProfessorRouter = require('./router/ProfessorRouter');
const AlunoRouter = require('./router/AlunoRouter');
const DisciplinaRouter = require('./router/DisciplinaRouter');
const DisciplinaProfessorRouter = require('./router/DisciplinaProfessorRouter');
const AtividadeRouter = require('./router/AtividadeRouter');
const AtividadeEntregueRouter = require('./router/AtividadeEntregueRouter');

const app = express();

const portaServico = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'pages')));
app.use('/style', express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'style')));
app.use('/script', express.static(path.join(__dirname, '..', '..', 'frontend', 'src', 'script')));
app.use('/imgs', express.static(path.join(__dirname, '..', '..', 'frontend', 'imgs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}



const turmaRoteador = new TurmaRouter();
const professorRoteador = new ProfessorRouter();
const alunoRoteador = new AlunoRouter();
const disciplinaRoteador = new DisciplinaRouter();
const disciplinaProfessorRoteador = new DisciplinaProfessorRouter();
const atividadeRoteador = new AtividadeRouter();
const atividadeEntregueRoteador = new AtividadeEntregueRouter();
const loginRoteador = new LoginRouter();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'pages', 'pagina_inicial.html'));
});

app.use('/login', loginRoteador.criarRotasLogin());
app.use('/turmas',turmaRoteador.criarRotasTurma());
app.use('/professores', professorRoteador.criarRotasProfessor());
app.use('/alunos', alunoRoteador.criarRotasAluno());
app.use('/disciplinas', disciplinaRoteador.criarRotasDisciplina());
app.use('/disciplinas-professores', disciplinaProfessorRoteador.criarRotasDisciplinaProfessor());
app.use('/atividades', atividadeRoteador.criarRotasAtividade());
app.use('/atividades-entregues', atividadeEntregueRoteador.criarRotasAtividadeEntregue());

app.listen(portaServico, () => {    
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});

