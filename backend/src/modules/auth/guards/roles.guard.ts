import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolUsuarioEnum } from "../enums/roles-usuarios.enum";
import { ROLES_KEY } from "../decoradors/roles.decorador";



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RolUsuarioEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if(!requiredRoles){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const usuario = request['usuario']

        const permiso = requiredRoles.includes(usuario?.rol)

        if (!permiso){
            throw new ForbiddenException('Acceso denegado: No posee el rol para esta acción')
        }

        return true
    }

}