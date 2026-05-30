import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProyectoDto {
  @ApiProperty({ example: 'proyecto 1' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  idCliente?: number;
}
