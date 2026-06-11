import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RolUsuarioEnum } from '../enums/roles-usuarios.enum';

export interface JwtPayload {
  nombre: string;
  sub: number;
  rol : RolUsuarioEnum // <---integrando rol
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;
    const [type, token] = authorizationHeader?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['usuario'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
