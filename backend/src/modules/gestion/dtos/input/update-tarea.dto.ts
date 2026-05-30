import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadosTareasEnum } from '../../enums/estados-tareas.enum';
import { CreateTareaDto } from './create-tarea.dto';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {
  @ApiProperty({
    enum: EstadosTareasEnum,
    example: EstadosTareasEnum.FINALIZADA,
    required: false,
  })
  @IsEnum(EstadosTareasEnum)
  @IsOptional()
  estado?: EstadosTareasEnum;
}
