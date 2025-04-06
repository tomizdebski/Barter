import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // Sprawdź, czy użytkownik jest zalogowany na podstawie session.userId
    return !!request.session?.userId; // Zwraca true, jeśli userId istnieje
  }
}
