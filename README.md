# 🏢 Sistema de Gestão de Folha de Pagamento Contábil

Sistema Full Stack desenvolvido para uma empresa de contabilidade encarregada de prestar serviços de folha de pagamento para empresas clientes.

Este projeto atende e expande os requisitos acadêmicos da disciplina, migrando do protótipo inicial em localStorage para uma **arquitetura real com backend em Node.js/Express, banco de dados relacional via Prisma ORM, autenticação JWT, integração com o Google e frontend em React + TypeScript**.

*(Nota: O arquivo `index.html` na raiz contém o protótipo estático de referência da disciplina).*

---

## 🌟 Novas Funcionalidades Implementadas

### 1. 🏢 Cadastro Completo de Empresas Clientes
Cadastro detalhado das empresas atendidas pela contabilidade com os seguintes dados:
- **Identificação:** Razão Social (`razao`), Nome Fantasia (`fantasia`) e CNPJ com máscara e validação.
- **Contato:** Nome do Responsável de RH, Telefone comercial e E-mail corporativo.
- **Localização:** Endereço completo (Logradouro, Bairro, Cidade, Estado/UF e CEP).
- **Parâmetros Operacionais:** Opção de controle de ponto integrado (*"Sim"* ou *"Não, apenas folha"*).
- **Vínculo:** Vinculação automática ou manual com a Prestadora Contábil responsável.
- **Gestão:** Listagem com busca em tempo real, visualização de ficha completa, edição e exclusão.

### 2. 🔐 Acesso Livre ("Qualquer e-mail com senha válida pode logar")
- **Auto-registro no Login:** Qualquer usuário que informar um e-mail corporativo ou pessoal e uma senha de no mínimo 6 caracteres terá sua conta criada automaticamente no primeiro acesso.
- **Segurança:** Caso o e-mail já exista no banco, a senha é validada de forma segura com salt Bcrypt.
- **Aba "Criar Conta":** Disponibilizada para usuários que desejarem definir seu nome completo explicitamente antes de entrar.

### 3. 🌐 Integração Oficial com o Google ("Entrar com o Google")
- Botão oficial estilizado **"Continuar com o Google"** na tela de login.
- Suporte a autenticação via Google Identity Services (`google-auth-library` no backend).
- Criação e sincronização automática de perfil (avatar, nome, e-mail) vinculado à conta Google.
- Modal com seleção de contas de teste rápidas para desenvolvimento local e homologação imediata.

---

## 🚀 Como Rodar o Projeto Full Stack

### Pré-requisitos:
- Node.js versão `>= 18.x`
- npm versão `>= 9.x`

### 1. Backend (API REST)
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:push     # Sincroniza tabelas no banco de dados local
npm run prisma:seed     # Cadastra o Usuário Mestre inicial
npm run dev             # Servidor iniciado em http://localhost:3333
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev             # Aplicação iniciada em http://localhost:5173
```

Acesse no navegador: **`http://localhost:5173`**

---

## 🔑 Credenciais Padrão para Testes Rápidos

| Perfil | E-mail | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **👑 Usuário Mestre** | `admin@contabilidade.com` | `admin_master_123` | Administrador geral do sistema com acesso total |
| **🏢 Gestor RH Cliente** | `rh@techsolutions.com.br` | `cliente_pass_123` | Administrador da empresa cliente demonstrativa |
| **🌐 Login com Google** | Clique em *"Continuar com o Google"* | — | Acesso instantâneo via conta Google |
| **✨ Qualquer Novo Usuário** | Digite qualquer e-mail e senha (mín. 6 dígitos) | — | Conta criada e autenticada automaticamente |
