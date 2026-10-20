# Sistema de folha de pagamento

Sistema web para uma empresa de contabilidade que presta serviço de folha de pagamento a empresas clientes.

## Como usar

Abra o arquivo `index.html` no navegador. Não precisa instalar nada.

No primeiro acesso, crie o usuário mestre. O sistema mostra uma chave de recuperação: guarde-a, pois ela permite redefinir a senha sem perder os dados.

## O que o sistema faz

- Login com três perfis: Mestre, Gerente e Operador
- Cadastro de empresas clientes, funcionários (dados pessoais, contratuais, bancários e filhos), cargos com código, jornadas e rubricas
- Controle de ponto com tolerância, limite de horas extras e ajustes que preservam a marcação original
- Folha de pagamento por competência, com proventos, descontos, INSS progressivo (tabela 2026), férias, 13º, adiantamento e FGTS informativo
- Fluxo Rascunho, Conferida e Fechada, contracheque para impressão e relatório mensal
- Exportação e importação de backup dos dados

## Observações

- Os dados ficam salvos no navegador de quem usa (localStorage). Para uso real com clientes, é preciso um servidor com banco de dados e autenticação segura.
- Imposto de renda está fora do escopo inicial.
- Percentuais de horas extras (50%), adicional noturno (20%) e FGTS (8%) são valores iniciais editáveis em Rubricas e devem ser confirmados.
- A tabela do INSS fica em Rubricas e deve ser atualizada todo início de ano.

## Publicar no GitHub Pages

Em Settings, Pages, escolha a branch `main` e a pasta raiz.
