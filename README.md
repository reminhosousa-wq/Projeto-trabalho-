# Folha Certa — Sistema de Gestão de Folha de Pagamento

Base inicial de interface para um sistema destinado a um escritório de contabilidade, alinhada aos módulos descritos no documento de requisitos.

## Situação atual

Esta versão é um **protótipo inicial de interface**. A navegação e algumas interações locais funcionam, mas ainda não há banco de dados conectado, autenticação real, persistência dos cadastros ou cálculos oficiais de folha. Não use dados pessoais reais nem processe pagamentos com esta versão.

## Requisitos

- Node.js 20 ou superior (recomendado)
- npm
- Git (para versionamento)

## Executar localmente no Windows PowerShell

```powershell
npm.cmd install
npm.cmd run dev
```

Abra http://localhost:3000 no navegador.

## Próximas etapas

1. Configurar projeto Supabase e variáveis de ambiente.
2. Implementar autenticação e autorização.
3. Criar migrações SQL, relacionamentos e políticas RLS.
4. Implementar formulários completos de empresas, funcionários, dependentes, cargos e jornadas.
5. Implementar controle de ponto com trilha de auditoria imutável das marcações originais.
6. Definir e validar as regras de rubricas e cálculos com profissional contábil.
7. Implementar fechamento, histórico e relatórios da folha.
8. Testar segurança, backups e permissões antes de produção.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores a partir das configurações do seu próprio projeto Supabase. Não compartilhe nem envie `.env.local` ao GitHub.

## GitHub

Antes de enviar, confira:

```powershell
git status
```

Certifique-se de que nenhum arquivo `.env.local`, credencial, dado pessoal ou banco com dados reais esteja preparado para commit.

Exemplo para um repositório GitHub já criado:

```powershell
git init
git branch -M main
git add .
git commit -m "Criacao inicial do sistema de folha de pagamento"
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Se já existir um repositório Git local ou um remoto `origin`, não repita `git init` ou `git remote add origin` sem antes verificar a configuração com `git status` e `git remote -v`.
