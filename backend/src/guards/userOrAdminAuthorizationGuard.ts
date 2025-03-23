import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdToModify = request.params.id; // ID que intentan modificar

    // Si no es admin, solo puede modificarse a sí mismo
    if (!user || user.userId !== String(userIdToModify)) {
      throw new ForbiddenException({ category: 'authorization', message: `Access denied. You don't have permissions to do this` });
    }

    // Si es admin, tiene permiso
    if (user.role === 'admin') {
      return true;
    }

    return true;
  };
};