import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si el usuario quiere ejecutar un endpoint que no le es permitido, saltará un error
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException({ category: 'authorization', message: `Access denied. You don't have permissions to do this` });
    }

    return true; // Permitir acceso
  };
};