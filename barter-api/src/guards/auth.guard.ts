import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('AuthGuard: session =', request.session);

    if (!request.session?.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return true;
  }
}

