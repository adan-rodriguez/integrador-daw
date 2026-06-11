import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosUsuariosEnum } from '../enums/estados-usuarios.enum';
import { RolUsuarioEnum } from '../enums/roles-usuarios.enum';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column()
  clave!: string;

  @Column({ type: 'enum', enum: EstadosUsuariosEnum })
  estado!: EstadosUsuariosEnum;

  // 👇 Esta es la nueva columna que agregamos
  @Column({ type: 'enum', enum: RolUsuarioEnum, default: RolUsuarioEnum.USUARIO })
  rol!: RolUsuarioEnum;
}
