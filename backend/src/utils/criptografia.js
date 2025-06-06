const bcrypt = require('bcrypt');

const saltRounds = 10;

async function gerarHashSenha(senha) {
  return await bcrypt.hash(senha, saltRounds);
}

async function compararSenha(senha, hash) {
  return await bcrypt.compare(senha, hash);
}

module.exports = {
  gerarHashSenha,
  compararSenha
};
