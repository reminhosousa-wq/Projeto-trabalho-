import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthenticatedUserPayload } from '../types/roles.js';

export function signToken(payload: AuthenticatedUserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): AuthenticatedUserPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthenticatedUserPayload;
}
