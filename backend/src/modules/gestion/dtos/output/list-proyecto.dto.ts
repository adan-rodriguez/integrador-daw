import { ApiProperty } from '@nestjs/swagger';
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';
import { ListClienteDTO } from './list-cliente.dto';

export class ListProyectoDTO {
  @ApiProperty({ example: '1' })
  id!: number;

  @ApiProperty({ example: 'proyecto 1' })
  nombre!: string;

  @ApiProperty({
    enum: EstadosProyectosEnum,
    example: EstadosProyectosEnum.ACTIVO,
  })
  estado!: EstadosProyectosEnum;

  @ApiProperty()
  cliente!: ListClienteDTO;
}
