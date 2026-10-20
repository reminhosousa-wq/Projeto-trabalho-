import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { UserRole } from '../types/roles.js';
import { env } from '../config/env.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

function formatNameFromEmail(identifier: string): string {
  const [localPart] = identifier.split('@');
  return localPart
    .replace(/[._-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function loginService(loginOrEmail: string, plainPassword: string) {
  if (!loginOrEmail || !loginOrEmail.trim()) {
    throw new AppError('Informe seu usuário ou e-mail.', 400);
  }
  if (!plainPassword) {
    throw new AppError('Informe sua senha de acesso.', 400);
  }

  const rawInput = loginOrEmail.trim().toLowerCase();
  const normalizedEmail = rawInput.includes('@') ? rawInput : `${rawInput}@sistema.local`;
  const extractedUsername = rawInput.includes('@') ? rawInput.split('@')[0] : rawInput;

  // Busca o usuário tanto por e-mail quanto por nome de usuário (username)
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: rawInput },
        { email: normalizedEmail },
        { username: rawInput },
        { username: extractedUsername },
      ],
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
          taxId: true,
        },
      },
    },
  });

  // Se o usuário ainda não existe no sistema, cria e salva no banco de dados automaticamente
  if (!user) {
    const passwordHash = await hashPassword(plainPassword);
    const generatedName = formatNameFromEmail(extractedUsername) || extractedUsername;

    user = await prisma.user.create({
      data: {
        name: generatedName,
        username: extractedUsername,
        email: normalizedEmail,
        passwordHash,
        role: UserRole.CLIENT_USER,
        isActive: true,
        lastLoginAt: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            tradeName: true,
            companyType: true,
            taxId: true,
          },
        },
      },
    });
  } else {
    // Se o usuário já existe, valida se a conta está ativa e se a senha confere
    if (!user.isActive) {
      throw new AppError('Esta conta de usuário está desativada no momento.', 403);
    }

    const isPasswordValid = await comparePassword(plainPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Senha incorreta para o usuário ou e-mail informado.', 401);
    }

    // Atualiza data do último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
    companyId: user.companyId,
  };

  const token = signToken(tokenPayload);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      companyId: user.companyId,
      company: user.company,
      lastLoginAt: user.lastLoginAt,
    },
  };
}

export async function registerService(name: string | undefined, loginOrEmail: string, plainPassword: string) {
  if (!loginOrEmail || !loginOrEmail.trim()) {
    throw new AppError('Informe o nome de usuário ou e-mail desejado.', 400);
  }
  if (!plainPassword) {
    throw new AppError('A senha é obrigatória.', 400);
  }

  const rawInput = loginOrEmail.trim().toLowerCase();
  const normalizedEmail = rawInput.includes('@') ? rawInput : `${rawInput}@sistema.local`;
  const extractedUsername = rawInput.includes('@') ? rawInput.split('@')[0] : rawInput;

  // Verifica se o usuário já existe no banco
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: rawInput },
        { email: normalizedEmail },
        { username: rawInput },
        { username: extractedUsername },
      ],
    },
  });

  if (existing) {
    throw new AppError('Este usuário já está cadastrado no sistema. Faça login diretamente.', 409);
  }

  const passwordHash = await hashPassword(plainPassword);
  const displayName = name?.trim() || formatNameFromEmail(extractedUsername) || extractedUsername;

  const newUser = await prisma.user.create({
    data: {
      name: displayName,
      username: extractedUsername,
      email: normalizedEmail,
      passwordHash,
      role: UserRole.CLIENT_USER,
      isActive: true,
      lastLoginAt: new Date(),
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
          taxId: true,
        },
      },
    },
  });

  const token = signToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role as UserRole,
    companyId: newUser.companyId,
  });

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      companyId: newUser.companyId,
      company: newUser.company,
      lastLoginAt: newUser.lastLoginAt,
    },
  };
}

interface GoogleAuthDTO {
  credential?: string;
  email?: string;
  name?: string;
  googleId?: string;
  avatarUrl?: string;
}

export async function googleLoginService(dto: GoogleAuthDTO) {
  let googleEmail = dto.email;
  let googleName = dto.name;
  let googleSub = dto.googleId;
  let googlePicture = dto.avatarUrl;

  if (dto.credential) {
    try {
      if (env.GOOGLE_CLIENT_ID) {
        const ticket = await googleClient.verifyIdToken({
          idToken: dto.credential,
          audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          googleEmail = payload.email;
          googleName = payload.name;
          googleSub = payload.sub;
          googlePicture = payload.picture;
        }
      } else {
        const parts = dto.credential.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          googleEmail = payload.email || googleEmail;
          googleName = payload.name || googleName;
          googleSub = payload.sub || googleSub;
          googlePicture = payload.picture || googlePicture;
        }
      }
    } catch (err) {
      console.warn('[Google Auth] Erro ao validar token oficial Google:', err);
    }
  }

  if (!googleEmail) {
    throw new AppError('Não foi possível identificar a conta Google.', 400);
  }

  const normalizedEmail = googleEmail.trim().toLowerCase();
  const extractedUsername = normalizedEmail.split('@')[0];

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        { googleId: googleSub },
      ],
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
          taxId: true,
        },
      },
    },
  });

  if (!user) {
    const dummyPassword = await hashPassword(`google_${Date.now()}_${Math.random()}`);

    user = await prisma.user.create({
      data: {
        name: googleName || formatNameFromEmail(extractedUsername),
        username: extractedUsername,
        email: normalizedEmail,
        passwordHash: dummyPassword,
        googleId: googleSub || null,
        avatarUrl: googlePicture || null,
        role: UserRole.CLIENT_USER,
        isActive: true,
        lastLoginAt: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            tradeName: true,
            companyType: true,
            taxId: true,
          },
        },
      },
    });
  } else {
    if (!user.isActive) {
      throw new AppError('Esta conta de usuário está desativada no momento.', 403);
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: googleSub || user.googleId,
        avatarUrl: googlePicture || user.avatarUrl,
        lastLoginAt: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            tradeName: true,
            companyType: true,
            taxId: true,
          },
        },
      },
    });
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
    companyId: user.companyId,
  };

  const token = signToken(tokenPayload);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      companyId: user.companyId,
      company: user.company,
      lastLoginAt: user.lastLoginAt,
    },
  };
}

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      avatarUrl: true,
      isActive: true,
      companyId: true,
      createdAt: true,
      lastLoginAt: true,
      company: {
        select: {
          id: true,
          name: true,
          tradeName: true,
          companyType: true,
          taxId: true,
          providerId: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  return user;
}
