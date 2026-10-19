import { Injectable, UnauthorizedException } from '@nestjs/common';
import { importSPKI, jwtVerify, type JWTPayload, type CryptoKey } from 'jose';
export interface VerifiedAccessToken {
  userId: string;
}

@Injectable()
export class JwtVerifierService {
  private publicKeyPromise?: Promise<CryptoKey>;
  private getPublicKey(): Promise<CryptoKey> {
    if (!this.publicKeyPromise) {
      const encodedKey = process.env.STAYHUB_JWT_PUBLIC_KEY;

      if (!encodedKey) {
        throw new Error('STAYHUB_JWT_PUBLIC_KEY is not configured');
      }

      const publicKey = encodedKey.replace(/\\n/g, '\n');

      this.publicKeyPromise = importSPKI(publicKey, 'RS256').catch(
        (error: unknown) => {
          this.publicKeyPromise = undefined;
          throw error;
        },
      );
    }

    return this.publicKeyPromise;
  }

  async verifyAccessToken(token: string): Promise<VerifiedAccessToken> {
    const issuer = process.env.STAYHUB_JWT_ISSUER;
    const audience = process.env.STAYHUB_JWT_AUDIENCE;

    if (!issuer || !audience) {
      throw new Error('JWT issuer or audience is not configured');
    }

    const publicKey = await this.getPublicKey();

    let payload: JWTPayload;

    try {
      const result = await jwtVerify(token, publicKey, {
        algorithms: ['RS256'],
        issuer,
        audience,
        requiredClaims: ['sub', 'iat', 'exp', 'token_use'],
      });

      payload = result.payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (
      typeof payload.sub !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        payload.sub,
      ) ||
      payload.token_use !== 'access'
    ) {
      throw new UnauthorizedException('Invalid access token claims');
    }

    return {
      userId: payload.sub,
    };
  }
}
