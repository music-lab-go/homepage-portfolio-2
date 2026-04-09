import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'admin_token';
const EXPIRY = '8h';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: { username: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ username: string }> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { username: string };
}
