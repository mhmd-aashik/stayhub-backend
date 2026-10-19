import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class HostAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: {
        authorization?: string | string[];
      };
    }>();

    const authorization = request.headers.authorization;

    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    // Authentication is not yet implemented.
    // Never trust a token without verifying it.
    throw new UnauthorizedException('Token verification is not configured');
  }
}
