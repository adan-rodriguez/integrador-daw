import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entitites/usuario.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
    TypeOrmModule.forFeature([Usuario]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsuariosService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
