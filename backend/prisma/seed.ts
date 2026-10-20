import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [Seed] Iniciando semeadura do banco de dados...');

  // 1. Dados do Usuário Mestre vindos de variáveis ou valores padrão
  const masterEmail = process.env.MASTER_ADMIN_EMAIL || 'admin@contabilidade.com';
  const masterPassword = process.env.MASTER_ADMIN_PASSWORD || 'admin_master_123';
  const masterName = process.env.MASTER_ADMIN_NAME || 'Administrador Geral (Super Admin)';

  // 2. Criação da Empresa Prestadora Modelo (A própria Contabilidade)
  const providerTaxId = '12345678000199';
  let providerCompany = await prisma.company.findUnique({
    where: { taxId: providerTaxId },
  });

  if (!providerCompany) {
    providerCompany = await prisma.company.create({
      data: {
        name: 'Alfa Serviços Contábeis e Folha Ltda',
        tradeName: 'Alfa Contabilidade',
        taxId: providerTaxId,
        companyType: 'PROVIDER',
        email: 'contato@alfacontabil.com.br',
        phone: '(11) 3456-7890',
        address: 'Av. Paulista, 1000 - Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310-100',
        isActive: true,
      },
    });
    console.log(`✅ [Seed] Empresa Prestadora criada: ${providerCompany.name}`);
  } else {
    console.log(`ℹ️ [Seed] Empresa Prestadora já existente: ${providerCompany.name}`);
  }

  // 3. Criação ou Atualização do Usuário Mestre (Super Admin)
  const masterHashedPassword = await bcrypt.hash(masterPassword, 10);

  const masterUser = await prisma.user.upsert({
    where: { email: masterEmail },
    update: {
      passwordHash: masterHashedPassword,
      role: 'MASTER_ADMIN',
      isActive: true,
    },
    create: {
      name: masterName,
      email: masterEmail,
      passwordHash: masterHashedPassword,
      role: 'MASTER_ADMIN',
      companyId: providerCompany.id,
      isActive: true,
    },
  });

  console.log(`✅ [Seed] Usuário Mestre garantido no sistema:`);
  console.log(`   - Nome: ${masterUser.name}`);
  console.log(`   - E-mail: ${masterUser.email}`);
  console.log(`   - Senha: ${masterPassword}`);
  console.log(`   - Role: ${masterUser.role}`);

  // 4. Criação de Empresa Cliente de Demonstração (atendida pela Prestadora)
  const clientTaxId = '98765432000188';
  let clientCompany = await prisma.company.findUnique({
    where: { taxId: clientTaxId },
  });

  if (!clientCompany) {
    clientCompany = await prisma.company.create({
      data: {
        name: 'Tech Solutions Comércio e Serviços Ltda',
        tradeName: 'Tech Solutions',
        taxId: clientTaxId,
        companyType: 'CLIENT',
        email: 'rh@techsolutions.com.br',
        phone: '(11) 98765-4321',
        address: 'Rua Funchal, 200 - Vila Olímpia',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '04551-060',
        isActive: true,
        providerId: providerCompany.id, // Vinculada à Alfa Contabilidade!
      },
    });
    console.log(`✅ [Seed] Empresa Cliente demonstrativa criada: ${clientCompany.name}`);
  }

  // 5. Criação de um Administrador da Empresa Cliente (para testes de permissão da equipe)
  const clientAdminEmail = 'rh@techsolutions.com.br';
  const clientAdminPassword = 'cliente_pass_123';
  const clientHashedPassword = await bcrypt.hash(clientAdminPassword, 10);

  await prisma.user.upsert({
    where: { email: clientAdminEmail },
    update: {
      passwordHash: clientHashedPassword,
      role: 'CLIENT_ADMIN',
      companyId: clientCompany.id,
      isActive: true,
    },
    create: {
      name: 'Mariana Silva (Gestora RH Cliente)',
      email: clientAdminEmail,
      passwordHash: clientHashedPassword,
      role: 'CLIENT_ADMIN',
      companyId: clientCompany.id,
      isActive: true,
    },
  });

  console.log(`✅ [Seed] Usuário Cliente Demonstrativo criado:`);
  console.log(`   - E-mail: ${clientAdminEmail}`);
  console.log(`   - Senha: ${clientAdminPassword}`);
  console.log(`   - Role: CLIENT_ADMIN`);

  console.log('🎉 [Seed] Semeadura concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ [Seed] Erro ao executar a semeadura:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
