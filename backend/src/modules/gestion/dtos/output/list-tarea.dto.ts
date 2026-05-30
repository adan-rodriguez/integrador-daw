import { ApiProperty } from '@nestjs/swagger';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';

export class ListTareaDTO {
  @ApiProperty({ example: '1' })
  id!: number;

  @ApiProperty({ example: 'tarea 1' })
  descripcion!: string;

  @ApiProperty({
    enum: EstadosTareasEnum,
    example: EstadosTareasEnum.PENDIENTE,
  })
  estado!: EstadosTareasEnum;
}
