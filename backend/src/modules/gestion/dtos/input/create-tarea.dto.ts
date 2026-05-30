import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTareaDto {
  @ApiProperty({ example: 'tarea 1' })
  @IsString()
  @IsNotEmpty()
  descripcion!: string;
}
