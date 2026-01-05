import { SignJWT } from 'jose';
import { UserRole } from '@/types';

// Cataloging service JWT secret (from environment variable)
const CATALOGING_JWT_SECRET = process.env.NEXT_PUBLIC_CATALOGING_JWT_SECRET || '';

/**
 * Generate a JWT token for the cataloging service client-side.
 * This is needed because the cataloging backend doesn't have a /auth/login endpoint.
 * 
 * SECURITY NOTE: The JWT secret is exposed in the frontend. This is acceptable
 * only because the cataloging service is a known backend with this limitation.
 */
export async function generateCatalogingToken(userId: string, role: UserRole): Promise<string> {
  if (!CATALOGING_JWT_SECRET) {
    throw new Error('NEXT_PUBLIC_CATALOGING_JWT_SECRET is not configured');
  }

  const secret = new TextEncoder().encode(CATALOGING_JWT_SECRET);
  
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}
