import { ApiProperty } from '@nestjs/swagger';
import { EstadosProyectosEnum } from '../../enums/estados-proyectos.enum';
import { ListTareaDTO } from './list-tarea.dto';

export class ProyectoDTO {
  @ApiProperty({ example: 'proyecto 1' })
  nombre!: string;

  @ApiProperty({
    enum: EstadosProyectosEnum,
    example: EstadosProyectosEnum.ACTIVO,
  })
  estado!: EstadosProyectosEnum;

  @ApiProperty({ example: 'Juan' })
  cliente?: string;

  @ApiProperty({ type: () => ListTareaDTO, isArray: true })
  tareas!: ListTareaDTO[];
}
